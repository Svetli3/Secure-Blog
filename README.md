How to Run Our Blog
-------------------

1. Create the Database by running the following SQL commands in PostgreSQL (We used PGAdmin for the UI):

CREATE USER hamster WITH PASSWORD 'ayshhJZIy4tCHBrkJRxld5cxLVyIBSt2CWBHJMgffB9POvNqN4';

drop table if exists posts;
drop table if exists users;

CREATE TABLE users (
    userid INTEGER DEFAULT FLOOR(RANDOM() * 999999) + 1 PRIMARY KEY,
    profilepicid NUMERIC DEFAULT FLOOR(RANDOM() * 11) + 1 NOT NULL,
    displayname TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    salt TEXT NOT NULL,
    password TEXT NOT NULL,
    latestaddress TEXT UNIQUE
);

CREATE TABLE posts (
    postid INTEGER DEFAULT FLOOR(RANDOM() * 999999) + 1 PRIMARY KEY,
    userid INTEGER,
    image TEXT,
    text TEXT NOT NULL,
    date DATE NOT NULL default CURRENT_DATE,
    CONSTRAINT "userID Foreign Key" FOREIGN KEY (userid)
    REFERENCES public.users (userid) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

GRANT SELECT, INSERT, UPDATE, DELETE ON users TO hamster;
GRANT SELECT, INSERT, UPDATE, DELETE ON posts TO hamster;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO hamster;

INSERT INTO users(userid, profilepicid, displayname, username, email, salt, password, latestaddress) VALUES
	(1, 1, 'DemoAccount', '$2b$12$U/g13Q99iHRFd2GLvllC4uDGdEwjFen85t6.qq8bABU7XFm3hVauC', 'U2FsdGVkX18Y+lVfFQHsBlgx20v3DBCtsA5W68szvOaqRwSvfkbIcF0ZsuFFklWW', '$2b$12$9uOqnhhRc00mWRFH4FKSQu', '$2b$12$9uOqnhhRc00mWRFH4FKSQuWZbT6ktMCdYCHaYqYlIsdaccrJp97p.', '$2b$12$9uOqnhhRc00mWRFH4FKSQu/fgyV5enVWFKxXeDPF.N1yNPnHcrwpq'),
	(470278, 2, 'Emma123', '$2b$12$U/g13Q99iHRFd2GLvllC4ueplQaGSfC/4bUlkkD4CXE73nOfzKlmG', 'U2FsdGVkX18RwWzf2rhfkT2V50qHwOgq/qqyIXSJgFjoMFcCUNRW4SIMAC/VyELT', '$2b$12$XCNU4yuz7aC9smpZKRO6Gu', '$2b$12$XCNU4yuz7aC9smpZKRO6Guh6BQNyzcKeGCbevvszXxPOw8PBFAOia', '$2b$12$XCNU4yuz7aC9smpZKRO6GunZcHjWXiPglqwfarrQe/CdV4KAestyO'),
	(823808, 3, 'CamelGuy', '$2b$12$U/g13Q99iHRFd2GLvllC4uzrtqlSsQDDEuVUP9qs9GebuOc6K6E6W', 'U2FsdGVkX1+kUTi7i6m/oaiaKiIFlseVwtE9H5x/bRB8d36vmAc1Bt26ovMQmrsa', '$2b$12$g8G3m3vPj2SFbkyHwOPWEu', '$2b$12$g8G3m3vPj2SFbkyHwOPWEuoeuhRGXLW6.Ky1lrvnnHxMljAp1lYP2', '$2b$12$g8G3m3vPj2SFbkyHwOPWEuCZUZ3SNgvIl1o7AF5xAh1EYXonJqBYa'),
	(911978, 4, 'TreeButcher', '$2b$12$U/g13Q99iHRFd2GLvllC4uqj258LtFF0B269aQ0Ad0rqaWBj3YDQe', 'U2FsdGVkX18qir2tFNlfs3Pzr5iw0CUN51sgBp0UnkxqK+Yrp1BmVuPju1uNOKvJ', '$2b$12$FHtYkriO81/Mg1.ZZIQN1.', '$2b$12$FHtYkriO81/Mg1.ZZIQN1.i4K2H4mIUq4mK.GNmoT7Z42csuDI9pe', '$2b$12$FHtYkriO81/Mg1.ZZIQN1.a/0JJ6CK4UDwu2pmfBLLYVNd6fNOn.6'),
	(503437, 5, 'MaxNature1', '$2b$12$U/g13Q99iHRFd2GLvllC4uwSTQ4GncJaCC6mm5ZjMFKzlHoqvo3e.', 'U2FsdGVkX190gbjgClZhTT6/Y9zb0SUU4pFZtf0nZu4zR6iop93B2jdARlAbioWS', '$2b$12$Em14DwLWoDy3m//uoq/V6u', '$2b$12$Em14DwLWoDy3m//uoq/V6ulFFcLLNGO8k6hWjpwIFajG6.68nlHjq', '$2b$12$Em14DwLWoDy3m//uoq/V6uQRJT/4DqVjMxutJ6CgrpL8K1wCX9HNe'),
	(228381, 6, 'CamperCameron', '$2b$12$U/g13Q99iHRFd2GLvllC4uvywlEaViiKvorAFegDqGyPbGGibZ0P.', 'U2FsdGVkX1+YbGIiwvjAlC2+NY846WORW28CKTZC9z3cxAdlo4M8CLFLrOlJggl9', '$2b$12$cap99qnBW.aarJ3NUwbUsu', '$2b$12$cap99qnBW.aarJ3NUwbUsuCImdQPp8O9gk65Pj8shMLNUActgJfXq', '$2b$12$cap99qnBW.aarJ3NUwbUsuNk7.RSyMsJYBCgX.i.wrXDNkjwLHWC.'),
	(800773, 7, 'Medium_Terry', '$2b$12$U/g13Q99iHRFd2GLvllC4umysaiuwlHZUF0A0msXRewPEhZsNuQQa', 'U2FsdGVkX1+s4f6BJZVS9YKMx9KZhru7kS/axgFvfbNSVJSWz2Ivy6qn5FzONUlg', '$2b$12$1u18GEhqPWrBKsQ0lzxoE.', '$2b$12$1u18GEhqPWrBKsQ0lzxoE.h55utAtsliewbhXsztpr2qlmjhoyRV2', '$2b$12$1u18GEhqPWrBKsQ0lzxoE.KhEgXZnJ8eRonK.Z.P/DFkrjktwoov.'),
	(587636, 8, 'cosy tent', '$2b$12$U/g13Q99iHRFd2GLvllC4ugL9sqLFwi2C1HPcd13/wLD6eGo.zRlC', 'U2FsdGVkX1/710PK8eJxQTxsAFWM1Ati4G9zrZNfRt8kABfTqsR0s6+qb0vfnJNB', '$2b$12$gwLBX0XZ/GMFdCmooJxTyu', '$2b$12$gwLBX0XZ/GMFdCmooJxTyuuKysCMeSfV5eS.pnMvG4iCEgHzwiV8y', '$2b$12$gwLBX0XZ/GMFdCmooJxTyufnNsITbuCZKDbbUs8fyyyIxxRKUIVQW'),
	(936076, 9, 'Fizzy', '$2b$12$U/g13Q99iHRFd2GLvllC4uO4ZA2srdJonOB9yrrlQaeCdSdCYnSU.', 'U2FsdGVkX189W5vLSw5l0iSpoEEzryQyaOHlse6kkLsQQlFHuu4WrT9o6y1HBqXM', '$2b$12$46M3o8U4tZdXh6ZFuDQyP.', '$2b$12$46M3o8U4tZdXh6ZFuDQyP.QOxBi9X4TEX/Yk3DQ6sCm6zsW9P.R9S', '$2b$12$46M3o8U4tZdXh6ZFuDQyP.MW0tIeCaor1GPvWtiy.nImxb246mWZi'),
	(382720, 10, 'HarryRobinson', '$2b$12$U/g13Q99iHRFd2GLvllC4un8JHuxwRqNfRrqOg3Gzxe8Po.R0dHtW', 'U2FsdGVkX1+aJE+ACJmWpL7suiccv5/PSqncbqgOFfWhsbktVEsAcQfNK8EznkyW', '$2b$12$2arsWlZWI/4vNXzhvollS.', '$2b$12$2arsWlZWI/4vNXzhvollS.Us/Cs9nevv02kElqBpe63LHy00KRMOO', '$2b$12$2arsWlZWI/4vNXzhvollS.o4uoqV.z/Peg4xhBYbp.goPuBkJ8t3a');

INSERT INTO posts(userid, image, text, date) VALUES
	(470278, '/images/uploads/1715634431803.jpeg', 'Warning for anyone travelling to the US! There are Crazy busy flights at the moment. I hope it eases up soon. BTW, Take a look at this link: https://www.istockphoto.com/photos/cute-cat', '2024-05-13'),
	(470278, null, 'Happy holiday season everyone! safe travels.', '2024-05-13'),
	(823808, '/images/uploads/1715634642075.jpg', 'Went on an epic trip to the Sahara last Autumn. Met so many amazing people and the best part is that I got to ride Camels!!!', '2024-05-13'),
	(911978, '/images/uploads/1715634813595.jpg', 'Highly recommend making the trip to Sweden this Midsommar, my last trip there was amazing. I suggest it to all adventure seekers, such a nice atmosphere.', '2024-05-13'),
	(503437, '/images/uploads/1715634903932.jpg', 'This camping trip was nature to the max! I enjoyed every second of it. Hope everyone else can experience such nice weather.', '2024-05-13'),
	(228381, '/images/uploads/1715635017658.jpeg', 'Camper Cameron here with a super cool lakeside camping trip idea. Head to your nearest lake and line the insides of your tent with pillows. Nothing better for winter camping.', '2024-05-13'),
	(228381, null, 'Anyone else see the Northern Lights yesterday? https://giphy.com/gifs/cat-lol-vFKqnCdLPNOKc', '2024-05-13'),
	(800773, '/images/uploads/1715635276976.jpg', 'Terry would rate the French Kite festival 10/10. 100% would visit again, so much fun for the family.', '2024-05-13'),
	(587636, '/images/uploads/1715635353584.jpg', 'I CAUGHT THE BIGGEST FISH EVER IN THE LAKE DISTRICT YESTERDAY. I bet this could make the national news.', '2024-05-13'),
	(936076, '/images/uploads/1715635460432.jpg', 'Hey everyone. My brother recently went on a hot-air balloon ride with his co-workers. I just had to post about it here because I know you would all appreciate the insight.', '2024-05-13'),
	(382720, null, 'I find it amazing how many stars you can see in the sky without any light pollution. Looking out over the stars in the Scottish wilderness is truly magical.', '2024-05-13');



2. Run the Node Start Command in a new Terminal with the "BLOG" folder as the root of the directory (which can be done using the command "cd .\blog\"):

Node Start Command: "npm run start-dev"



3. Visit the site using the following URL:

Blog will be running on: "http://localhost:3000/"



4 (optional). Login with an existing account or signup a new user.

Here are the login details for an "Admin" account setup purely for viewing and demonstration purposes:
_____________________________
|Username: | "DemoUser"		 |
|Password: | "demo.password" |
|__________|_________________|
