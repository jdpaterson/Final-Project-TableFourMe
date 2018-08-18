CREATE TABLE "customers" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "phone" BIGINT NOT NULL,
  "email" VARCHAR(50)
);


CREATE TABLE "categories" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "img_url" TEXT
);

CREATE TABLE "reservations" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "placement_time" TIMESTAMP WITH TIME ZONE NOT NULL,
  "group_size" INTEGER NOT NULL,
  "status" VARCHAR(50) NOT NULL,
  "res_code" VARCHAR(10) NOT NULL,
  "customer_id" INTEGER REFERENCES customers("id")
);
CREATE TABLE "orders" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "price_declared" INTEGER NOT NULL DEFAULT 0,
  "total_paid" INTEGER NOT NULL DEFAULT 0,
  "is_paid" BOOLEAN NOT NULL DEFAULT false,
  "order_code" VARCHAR(10) NOT NULL,
  "reservation_id" INTEGER REFERENCES reservations("id")
);

CREATE TABLE "menu_items" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "description" TEXT,
  "price" INTEGER NOT NULL DEFAULT 0,
  "img_url" TEXT,
  "category_id" INTEGER REFERENCES categories("id")
);

CREATE TABLE "menu_items_orders"(
  "id" SERIAL NOT NULL PRIMARY KEY,
  "menu_item_id" INTEGER REFERENCES menu_items("id"),
  "order_id" INTEGER REFERENCES orders("id")
);