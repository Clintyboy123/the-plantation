"""Exports the venue photographs as WebP for the site and writes frontend/src/content/photos.json.

Usage:  python3 tools/photos.py
Sources live in assets-source/ (downloaded from theplantation.co.za, 39onchurch.co.za and peboma.co.za).
Edit CAST to change which photo goes where. Each photo is exported at up to three widths (800, 1600, 2400),
never upscaled, plus a tiny blurred placeholder that shows while the real image loads.
"""
import base64, io, json, os
from PIL import Image, ImageOps, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'assets-source')
OUT = os.path.join(HERE, '..', 'frontend', 'public', 'photos')
MANIFEST = os.path.join(HERE, '..', 'frontend', 'src', 'content', 'photos.json')
WIDTHS = (800, 1600, 2400)

P = 'plantation/'
C = '39onchurch/'
B = 'boma/'

# key: (source, alt text, gallery category or None, optional focal point "x% y%")
CAST = {
    # Hero + estate
    'hero-dusk': (P + '2018_11_Second-banner.jpg', 'The Plantation ballroom at dusk, its porch lit by strings of fairy lights beneath the old trees', None, '50% 60%'),
    'estate-aerial': (P + '2022_02_The-Plantation-Country-Retreat.jpg', 'Aerial view of The Plantation’s white roofs in the forest at sunset', None, '50% 50%'),
    'estate-forest-aerial': (P + '2022_02_The-Plantation-forest-accommodation.jpg', 'Aerial view of the suites tucked into the forest canopy', 'accommodation', '50% 50%'),
    'estate-night': (P + '2022_02_Plantation-wedding-5.jpg', 'The ballroom glowing through the forest at night', 'weddings', '50% 70%'),
    'estate-venue': (P + '2022_02_The-Plantation-wedding-venue.jpg', 'The ballroom’s porch and arched doors opening onto the garden', 'corporate', '50% 60%'),
    'estate-garden': (P + '2022_02_The-Plantation-wedding-venue-1.jpg', 'The garden path leading to the ballroom', None, '50% 60%'),

    # Weddings
    'chapel-aisle': (P + '2022_02_Plantation-wedding-24.jpg', 'The empty forest chapel aisle with white pews and chandelier', 'weddings', '50% 55%'),
    'chapel-exterior': (P + '2022_02_The-Plantation-chapel.jpg', 'The stone forest chapel among the trees', 'weddings', '50% 55%'),
    'chapel-vows': (P + '2022_02_Plantation-wedding-25.jpg', 'A couple saying their vows in the forest chapel', 'weddings', '50% 50%'),
    'chapel-kiss': (P + '2022_02_Plantation-wedding-35.jpg', 'Guests cheering as the couple kiss at the altar', 'weddings', '50% 45%'),
    'chapel-confetti': (P + '2022_02_Plantation-wedding-6.jpg', 'Confetti thrown over the newlyweds on the chapel steps', 'weddings', '50% 40%'),
    'chapel-aisle-walk': (P + '2022_02_Plantation-wedding-21.jpg', 'A bride walking down the candlelit chapel aisle', 'weddings', '50% 50%'),
    'couple-forest': (P + '2022_02_Plantation-wedding-29.jpg', 'A bride and groom close together in the forest, holding white roses', 'weddings', '45% 40%'),
    'couple-well': (P + '2022_02_Plantation-wedding-32.jpg', 'Newlyweds sitting at the old stone well in the courtyard', 'weddings', '50% 55%'),
    'couple-sunset': (P + '2022_02_Plantation-wedding-9.jpg', 'A couple walking along a coastal hill at sunset', 'weddings', '60% 50%'),
    'couple-golden': (P + '2022_02_Plantation-wedding-16.jpg', 'A couple embracing in golden afternoon light', 'weddings', '50% 40%'),
    'bride-forest': (P + '2022_02_Plantation-wedding-4.jpg', 'A bride standing among the trees, her train spread on the forest floor', 'weddings', '50% 50%'),
    'bride-path': (P + '2022_02_Plantation-wedding-22.jpg', 'A couple walking away down a sandy forest path', 'weddings', '50% 50%'),
    'bride-mirror': (P + '2022_02_Plantation-wedding-3.jpg', 'A bride’s reflection in an ornate mirror as she gets ready', 'weddings', '50% 30%'),
    'bride-cottage': (P + '2022_02_Plantation-wedding-10.jpg', 'A bride holding her bouquet beside the white cottage', 'weddings', '70% 50%'),
    'bridesmaids': (P + '2022_02_Plantation-wedding-8.jpg', 'Bridesmaids in rose dresses waiting outside the bridal suite', 'weddings', '50% 50%'),
    'groomsmen': (P + '2022_02_Plantation-wedding-23.jpg', 'The groom and his groomsmen on the lawn', 'weddings', '50% 45%'),
    'first-dance': (P + '2022_02_Plantation-wedding-30.jpg', 'A couple’s first dance in the ballroom', 'weddings', '50% 50%'),
    'sparklers': (P + '2022_02_Plantation-wedding-37.jpg', 'Guests holding sparklers at night', 'weddings', '50% 50%'),
    'ballroom-reception': (P + '2022_02_Plantation-wedding-38.jpg', 'A full ballroom reception with long wooden tables', 'weddings', '50% 50%'),
    'ballroom-greenery': (P + '2022_02_Plantation-wedding-26.jpg', 'Long tables with greenery runners in the light-filled ballroom', 'weddings', '50% 55%'),
    'ballroom-cake': (P + '2022_02_Plantation-wedding-27.jpg', 'A white wedding cake by the ballroom windows', 'weddings', '60% 55%'),
    'ballroom-empty': (P + '2022_02_Plantation-wedding-36.jpg', 'The ballroom set for a reception with a white-draped head table', 'weddings', '50% 55%'),
    'ballroom-tables': (P + '2022_02_Plantation-wedding-13.jpg', 'Rows of dressed tables down the length of the ballroom', 'weddings', '50% 55%'),
    'porch-guests': (P + '2022_02_Plantation-wedding-19a.jpg', 'Guests mingling on the ballroom porch', 'weddings', '50% 55%'),
    'forest-table': (P + '2026_07_Intimate-Wedding-Special-The-Plantation.jpg', 'An intimate long table under string lights in the forest at night', 'weddings', '50% 55%'),
    'drinks-buffet': (P + '2022_02_The-Plantation-drinks-buffet.jpg', 'A drinks station set up on the lawn', None, '50% 50%'),
    'cocktails': (P + '2022_02_The-Plantation-cocktails.jpg', 'Rows of rosé sparkling wine in champagne flutes', 'cuisine', '50% 50%'),

    # Corporate
    'corp-ballroom': (P + '2022_02_Corporate-Presentation-Plantation-Ballroom.jpg', 'The ballroom set with round tables for a corporate presentation', 'corporate', '50% 50%'),
    'corp-dinner': (P + '2022_02_Elegant-corporate-dinner.jpg', 'An elegant corporate dinner set in the ballroom', 'corporate', '50% 50%'),
    'corp-dinner-long': (P + '2022_02_Corporate-dinner-setup.jpg', 'Long tables with burgundy runners set for a corporate dinner', 'corporate', '50% 50%'),
    'corp-awards': (P + '2022_02_Awards-dinner-.jpg', 'The ballroom set for an awards dinner', 'corporate', '50% 50%'),
    'corp-barn-banquet': (P + '2022_02_Banquet-lunch-in-The-Plantation-Barn.jpg', 'A banquet lunch set in The Plantation barn', 'corporate', '50% 50%'),
    'corp-barn-cocktail': (P + '2022_02_Cocktail-setup-in-Plantation-barn.jpg', 'A cocktail function in the barn lit in violet', 'corporate', '50% 50%'),
    'corp-african': (P + '2022_02_African-themed-event.jpg', 'A colourful African-themed corporate event', 'corporate', '50% 50%'),
    'corp-conference': (P + '2018_10_corporateG4.jpg', 'Delegates seated theatre-style for a presentation', 'corporate', '50% 50%'),
    'corp-networking': (P + '2018_10_corporate_gallery4.jpg', 'Guests talking over drinks on the lawn', 'corporate', '50% 40%'),

    # Plantation suites
    'breakfast-tray': (P + '2018_11_bg-005.jpg', 'A breakfast tray with fruit, pastries and pancakes', 'accommodation', '50% 50%'),
    'king-1': (P + '2018_11_ks-gallery2.jpg', 'The King Suite: a king bed against a navy feature wall', 'accommodation', '50% 50%'),
    'king-2': (P + '2018_11_ks-gallery1.jpg', 'The King Suite lounge corner with striped armchair', 'accommodation', '50% 50%'),
    'king-3': (P + '2018_11_ks-gallery.jpg', 'The King Suite’s private patio', 'accommodation', '50% 50%'),
    'king-4': (P + '2018_11_ks-gallery5.jpg', 'The King Suite kitchenette', 'accommodation', '50% 50%'),
    'family-1': (P + '2018_11_fs-gallery2.jpg', 'The Family Suite with a double bed and single beds', 'accommodation', '50% 50%'),
    'family-2': (P + '2018_11_fs-gallery6.jpg', 'The Family Suite under its pitched ceiling', 'accommodation', '50% 50%'),
    'family-3': (P + '2018_11_fs-gallery4.jpg', 'The Family Suite patio in the garden', 'accommodation', '50% 50%'),
    'family-4': (P + '2018_11_fs-gallery3.jpg', 'The Family Suite kitchenette', 'accommodation', '50% 50%'),
    'honeymoon-1': (P + '2018_11_hs-gallery2.jpg', 'The Honeymoon Suite: a sleigh bed beneath floral wallpaper', 'accommodation', '50% 50%'),
    'honeymoon-2': (P + '2018_11_hs-gallery5.jpg', 'The Honeymoon Suite with its chandelier and robes', 'accommodation', '50% 50%'),
    'honeymoon-3': (P + '2018_11_hs-gallery3.jpg', 'Two red damask armchairs in the Honeymoon Suite', 'accommodation', '50% 50%'),
    'honeymoon-4': (P + '2018_11_hs-gallery6.jpg', 'The Honeymoon Suite opening onto the forest', 'accommodation', '50% 50%'),
    'bridal-boudoir': (P + '2018_10_Bridal-Suite-Dressing-Room.jpg', 'The French-inspired Bridal Boudoir dressing room', 'weddings', '50% 50%'),
    'bath': (P + '2018_11_fs-gallery5.jpg', 'A freestanding basin and bath with amenities', 'accommodation', '50% 50%'),

    # Cuisine
    'dish-lamb': (P + '2022_02_Lamb-Chop-Duet-Wedding-main.jpg', 'Lamb chop duet', 'cuisine', '50% 45%'),
    'dish-karoo': (P + '2022_02_Karoo-Feast-Wedding-Main.jpg', 'Karoo feast', 'cuisine', '50% 45%'),
    'dish-oxtail': (P + '2022_02_Oxtail-Wedding-Main-Meal.jpg', 'Oxtail', 'cuisine', '50% 50%'),
    'dish-xhosa': (P + '2022_02_Xhosa-Feast-wedding-main.jpg', 'Xhosa feast', 'cuisine', '50% 50%'),
    'dish-roulade': (P + '2022_02_Chicken-Roulade-Wedding-Main.jpg', 'Chicken roulade', 'cuisine', '50% 50%'),
    'dish-brownie': (P + '2022_02_Chocolate-Brownie-Cheesecake-Dessert.jpg', 'Chocolate brownie cheesecake', 'cuisine', '50% 50%'),
    'dish-jars': (P + '2022_02_The-Plantation-Dessert-Jars.jpg', 'Dessert jars', 'cuisine', '50% 50%'),
    'dish-bunny': (P + '2022_02_Mini-Bunny-Chow-canape.jpg', 'Mini bunny chow canapés', 'cuisine', '50% 50%'),
    'dish-boerewors': (P + '2022_02_Boerewors-canape.jpg', 'Boerewors canapés', 'cuisine', '50% 50%'),
    'dish-burger': (P + '2022_02_Burger-street-food-canape.jpg', 'Mini burger street-food canapés', 'cuisine', '50% 50%'),
    'dish-nachos': (P + '2022_02_Nachos-street-food-canape.jpg', 'Nacho street-food canapés', 'cuisine', '50% 50%'),
    'dish-salmon': (P + '2022_02_Smoke-salmon-wedding-starter.jpg', 'Smoked salmon starter', 'cuisine', '50% 50%'),
    'dish-calamari': (P + '2022_02_Calamari-wedding-starter.jpg', 'Calamari starter', 'cuisine', '50% 50%'),
    'dish-marrow': (P + '2022_02_Marrow-bone-wedding-starter.jpg', 'Marrow bone starter', 'cuisine', '50% 50%'),
    'dish-salad': (P + '2022_02_Biltong-salad-wedding-starter.jpg', 'Biltong salad starter', 'cuisine', '50% 50%'),
    'dish-potatoes': (P + '2022_02_Baby-Brown-Onion-Potatoes-Canape.jpg', 'Baby onion potato canapés', 'cuisine', '50% 50%'),

    # The Boma (photos from peboma.co.za)
    'boma-courtyard': (P + '2018_12_boma.jpg', 'The Boma’s cobbled forest courtyard leading to the glass-enclosed restaurant', 'boma', '50% 50%'),
    'boma-bonfire': (B + 'celebration-bonfire-desktop-HZa4wkN4.webp', 'A celebration set up beneath the trees at The Boma', 'boma', '50% 50%'),
    'boma-ceremony': (B + 'home-hero-desktop-CmQ6byUj.webp', 'A ceremony aisle of petals and wooden chairs on The Boma’s forest lawn', 'boma', '50% 55%'),
    'boma-forest-wedding': (B + 'wedding-ceremony-desktop-Bru_ft4U.webp', 'Guests gathered for a ceremony in the forest at The Boma', 'boma', '50% 50%'),
    'boma-garden': (B + 'secret-garden-desktop-Bo7i29VX.webp', 'The Boma’s secret garden path lit by paper lanterns', 'boma', '50% 50%'),
    'boma-night': (B + 'venue-night-desktop-BO8yHuLZ.webp', 'A couple dancing at night at The Boma', 'boma', '50% 50%'),
    'boma-seating': (B + 'venue-seating-desktop-CrsmX4SW.webp', 'Tables set inside The Boma’s timber-walled restaurant', 'boma', '50% 50%'),
    'boma-banquet': (B + 'wedding-banquet-desktop-CBUEgi3h.webp', 'A couple cutting their cake inside The Boma', 'boma', '50% 50%'),
    'boma-potjies': (B + 'potjies-desktop-DZ5CHXeT.webp', 'Cooks serving from three-legged potjie pots', 'boma', '50% 45%'),
    'boma-drumming': (B + 'drumming-workshop-desktop-BN7Gm8tw.webp', 'A drumming and dance performance at The Boma', 'boma', '50% 40%'),
    'boma-drinks': (B + 'welcome-drinks-desktop-Cbr9f6z_.webp', 'A welcome table of drinks and treats on the lawn', 'boma', '50% 50%'),
    'boma-cottage': (B + 'cottage-hero-desktop-DkttbTuu.webp', 'The twin bedroom in The Boma’s cottage', 'boma', '50% 50%'),

    # 39 on Church (photos from 39onchurch.co.za)
    'church-pool': (C + '2020_07_39-on-Church-Pool.jpg', 'The pool at 39 on Church framed by palms and the garden', 'church', '50% 55%'),
    'church-patio': (C + '2020_07_39-On-Church-patio-1.jpg', 'Morning sun over the pool terrace at 39 on Church', 'church', '50% 50%'),
    'church-king': (C + '2023_06_King1.jpg', 'The King suite at 39 on Church', 'church', '50% 50%'),
    'church-queen': (C + '2025_05_39-on-Church-Queen-Room-Donkin.jpg', 'A queen suite at 39 on Church', 'church', '50% 50%'),
    'church-queen-2': (C + '2025_05_39-on-Church-Queen-Room-Penguin.jpg', 'A queen suite with garden view at 39 on Church', 'church', '50% 50%'),
    'church-twin': (C + '2025_05_Twin-Room-4A-scaled.jpg', 'A twin suite at 39 on Church', 'church', '50% 50%'),
    'church-family': (C + '2020_07_39-on-Church-16.jpg', 'The family suite at 39 on Church', 'church', '50% 50%'),
    'church-cottage': (C + '2020_07_39-on-Church-Self-Catering-Garden-Cottage-1.jpg', 'The bedroom of the self-catering garden cottage', 'church', '50% 50%'),
    'church-lounge': (C + '2020_07_39-on-Church-27.jpg', 'One of the two lounges at 39 on Church', 'church', '50% 50%'),
    'church-dining': (C + '2020_07_39-on-Church-36.jpg', 'The sunny breakfast room at 39 on Church', 'church', '50% 50%'),
    'church-breakfast': (C + '2020_07_39-on-Church-9.jpg', 'Breakfast served at 39 on Church', 'church', '50% 50%'),
    'church-bar': (C + '2023_06_39-on-Church-bar-1.jpg', 'The honesty bar and lounge at 39 on Church', 'church', '50% 50%'),
    'church-conference': (C + '2023_06_Conference3.jpg', 'The conference room set in a U-shape', 'church', '50% 50%'),
    'church-conference-2': (C + '2020_07_39-on-Church-19.jpg', 'The fully equipped conference room at 39 on Church', 'church', '50% 50%'),
    'church-boardroom': (C + '2020_07_39-on-Church-7.jpg', 'The boardroom at 39 on Church', 'church', '50% 50%'),
    'church-addo': (C + '2020_07_39-on-Church-Addo-Elephant-National-Park.jpg', 'Elephants at Addo Elephant National Park', None, '50% 50%'),
    'church-sardinia': (C + '2020_07_Sardinia-Bay-Sunset.jpg', 'Sunset over the dunes at Sardinia Bay', None, '50% 50%'),
}


# Photographer credits printed into some originals. Trim that strip off the edge at export
# (a crop, never a stretch). Values are fractions of the height removed from (top, bottom).
CROP = {
    'estate-night': (0, 0.15),
    'first-dance': (0, 0.09), 'ballroom-greenery': (0, 0.09), 'ballroom-cake': (0, 0.09),
    'ballroom-empty': (0, 0.09), 'sparklers': (0, 0.09), 'chapel-aisle': (0, 0.09),
    'chapel-vows': (0, 0.09), 'couple-forest': (0, 0.09), 'bride-forest': (0, 0.09),
    'chapel-kiss': (0, 0.09), 'groomsmen': (0, 0.09), 'chapel-aisle-walk': (0, 0.09),
    'ballroom-reception': (0, 0.09), 'ballroom-tables': (0, 0.09), 'couple-golden': (0, 0.09),
    'chapel-confetti': (0, 0.09), 'bridesmaids': (0, 0.09), 'bride-cottage': (0, 0.09),
    'couple-well': (0, 0.09), 'porch-guests': (0, 0.09), 'couple-sunset': (0, 0.09),
}


def placeholder(im):
    tiny = im.copy()
    tiny.thumbnail((24, 24))
    tiny = tiny.filter(ImageFilter.GaussianBlur(1))
    buf = io.BytesIO()
    tiny.save(buf, 'WEBP', quality=40)
    return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()


def main():
    os.makedirs(OUT, exist_ok=True)
    for old in os.listdir(OUT):
        if old.endswith('.webp'):
            os.remove(os.path.join(OUT, old))
    manifest, missing = {}, []
    for key, (src, alt, category, focus) in CAST.items():
        path = os.path.join(SRC, src)
        if not os.path.exists(path):
            missing.append(src)
            continue
        im = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
        if key in CROP:
            top, bottom = CROP[key]
            W, H = im.size
            im = im.crop((0, round(H * top), W, H - round(H * bottom)))
        w, h = im.size
        widths = sorted({min(t, w) for t in WIDTHS})
        for size in widths:
            out = im if size == w else im.resize((size, round(h * size / w)), Image.LANCZOS)
            out.save(os.path.join(OUT, f'{key}-{size}.webp'), 'WEBP', quality=78, method=6)
        manifest[key] = {
            'widths': widths, 'width': w, 'height': h, 'alt': alt,
            'category': category, 'focus': focus, 'blur': placeholder(im),
        }
    with open(MANIFEST, 'w') as f:
        json.dump(manifest, f, indent=1)
    print(len(manifest), 'photos exported')
    if missing:
        print('MISSING:', *missing, sep='\n  ')


if __name__ == '__main__':
    main()
