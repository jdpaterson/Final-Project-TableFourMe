INSERT INTO customers
  (name, phone, email)
VALUES
  ('Paulina', 6043624496, 'paulinate@o2.pl');

INSERT INTO customers
  (name, phone, email)
VALUES
  ('John', 6043624496, 'john@john.pl');



INSERT INTO categories
  (name, img_url)
VALUES
  ('Appetizers',
    'https://www.rd.com/wp-content/uploads/2014/06/10-bite-sized-appetizers-mini-pancakes-fsl.jpg'
);

INSERT INTO categories
  (name, img_url)
VALUES
  ('Main Dishes',
    'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2013/11/25/0/FNK_pan-seared-salmon-with-kale-apple-salad_s4x3.jpg.rend.hgtvcom.616.462.suffix/1387918756116.jpeg'
);

INSERT INTO categories
  (name, img_url)
VALUES
  ('Desserts',
    'https://www.seriouseats.com/2018/01/20180116-cranachan-vicky-wasik-1-3-1500x1125.jpg'
);

INSERT INTO categories
  (name, img_url)
VALUES
  ('Drinks',
    'https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/01/15/15/kfc-gravy-cocktails-gravy-so-good-you-can-drink-it.jpg'
);




INSERT INTO menu_items
  (name, description, price , img_url, category_id)
VALUES
  ('Antojitos',
    ' These antojitos are loaded with cream cheese and peppers and are baked to perfection.',
    1050,
    'https://www.jocooks.com/wp-content/uploads/2012/08/antojitos-1-1.jpg',
    1
);

INSERT INTO menu_items
  (name, description, price , img_url, category_id)
VALUES
  ('Kale and Roasted Beets Salad',
    ' Tossed with walnuts and feta cheese; drizzled with a white balsamic vinaigrette.',
    1250,
    'https://www.spinach4breakfast.com/wp-content/uploads/2016/10/11-1.jpg',
    1
);

INSERT INTO menu_items
  (name, description, price , img_url, category_id)
VALUES
  ('Wedge Caesar Salad',
    ' Served with shaved Romano and Asiago cheese and a focaccia crouton.',
    950,
    'http://assets.kraftfoods.com/recipe_images/opendeploy/136315_640x428.jpg',
    1
);


INSERT INTO menu_items
  (name, description, price , img_url, category_id)
VALUES
  ('Steamed Salmon Fillet',
    'Stuffed with crab meat, baby shrimp and smoked salmon; served with a roasted red pepper sauce.',
    1800,
    'https://assets.blog.foodnetwork.ca/imageserve/wp-content/uploads/sites/6/2016/11/Poached-Salmon/x.jpg',
    2
);


INSERT INTO menu_items
  (name, description, price , img_url, category_id)
VALUES
  ('Spaghetti alla Salsiccia',
    'Italian sausage, chicken, bell peppers, and mushrooms in a classic tomato sauce.',
    2000,
    'https://ips.plug.it/cips/buonissimo.org/cms/2013/03/spaghetti-alla-salsiccia.jpg',
    2
);

INSERT INTO menu_items
  (name, description, price , img_url, category_id)
VALUES
  ('Braised Hind Shank of Lamb',
    'Moroccan spiced lamb, served with lamb au jus.',
    2050,
    'https://cleaversorganic.com.au/wp-content/uploads/sites/28/2016/07/pete-evans-SPICED-LAMB-BACK-STRAP.jpg',
    2
);

INSERT INTO menu_items
  (name, description, price , img_url, category_id)
VALUES
  ('Belgian Chocolate Terrine',
    'The rich taste of Belgian chocolate with a touch of Cointreau, served with creme anglaise and raspberry coulis.',
    1300,
    'http://www.christysgourmetgifts.com/sites/cggdev/img/products/323458Terrine_enlarge.JPG',
    3
);


INSERT INTO menu_items
  (name, description, price , img_url, category_id)
VALUES
  ('Vancouver Tiramisu',
    'Traditional Italian cheesecake made with marscapone cheese, with a hint of marsala wine and Kahlua liqueur.',
    1100,
    'https://images.food52.com/99NMfG34doJavR5y-DdJethifdM=/753x502/22ae29ea-d52f-4043-93a6-42eb68958b9d--IMG_4173_copy_web.jpg',
    3
);

INSERT INTO menu_items
  (name, description, price , img_url, category_id)
VALUES
  ('Ice Cream',
    'Chocolate and vanilla ice cream with your choice of either caramel sauce, chocolate sauce, vanilla custard or strawberry coulis.',
    8500,
    'https://i.pinimg.com/originals/45/8b/2e/458b2ebdb977bbe8b2a20ec1e8e98247.jpg',
    3
);


INSERT INTO menu_items
  (name, description, price , img_url, category_id)
VALUES
  ('House Wine',
    'Choice of red and white BC wines.Tasting notes include a medium body, raspberries, plums, black cherries, licorice, orange, coffee, toffee, chocolate, fruit cake. ',
    900,
    'https://images.thestar.com/ec4k2HSAMNNNEoRc9fs7V9tfoaw=/1086x725/smart/filters:cb(1506168295992)/https://www.thestar.com/content/dam/thestar/life/2017/09/22/to-tip-or-not-to-tip-should-we-calculate-gratuity-on-wine-at-a-restaurant/wine2.jpg',
    4
);

INSERT INTO menu_items
  (name, description, price , img_url, category_id)
VALUES
  ('Locally Draft Beer On Tap',
    'Discover a large selection of beer, including stout, lager, premium lager or bitter & ale from the local crafters',
    600,
    'https://www.straight.com/files/v3/styles/gs_large/public/images/16/05/istock_000060329700_medium.jpg?itok=UnjIhTz2',
    4
);

INSERT INTO menu_items
  (name, description, price , img_url, category_id)
VALUES
  ('Spanish Style Sangria',
    'House-made red wine and brandy “punch”, with it’s traditional heritage well-rooted in Spain.',
    800,
    'https://www.onceuponachef.com/images/2016/11/Pomegranate-Sangria-575x439.jpg',
    4
);


INSERT INTO reservations
  (placement_time, group_size, status, res_code, customer_id)
VALUES
  ('2018-07-07 18:00:00', 2, 'waiting', 'A2B93A', 1);

INSERT INTO reservations
  (placement_time, group_size, status, res_code, customer_id)
VALUES
  ('2018-07-07 18:30:00', 3, 'waiting', '2JS9ZB', 2);

INSERT INTO orders
  (price_declared, order_code, reservation_id)
VALUES
  (1050, 'A82NZ9', 1);

INSERT INTO orders
  (price_declared, order_code, reservation_id)
VALUES
  (3200, 'Q9EAS2', 2);


INSERT INTO menu_items_orders
  (menu_item_id, order_id)
VALUES
  (1, 1);

INSERT INTO menu_items_orders
  (menu_item_id, order_id)
VALUES
  (2, 2);

INSERT INTO menu_items_orders
  (menu_item_id, order_id)
VALUES
  (3, 2);

INSERT INTO menu_items_orders
  (menu_item_id, order_id)
VALUES
  (12, 2);





