CREATE TABLE "gorevler" (
	"id"	INTEGER NOT NULL,
	"gorev"	TEXT NOT NULL,
	"type"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO `gorevler` (`gorev`,`type`) VALUES ('Bitter Çikolata alacağım',0),('Test TO-DO Item',0);