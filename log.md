#09/04/2014
2:15 total

- 11:15 - 11:30 - project structure implemented with node / mongo / grunt
- 12:00 - 12:30 - basic crud implementation:

		curl --data "test=1&asd=2" http://localhost:3000/api/token
		{
			"test": "1",
			"asd": "2",
			"_id": "53451fccede2004698000001"
		}

		curl http://localhost:3000/api/token
		[
			{
				"test": "1",
				"asd": "2",
				"_id": "53451fccede2004698000001"
			}
		]

		curl -X PUT --data "test=2" http://localhost:3000/api/token/53451fccede2004698000001
		{
			"test": "2",
			"_id": "53451fccede2004698000001"
		}

		curl -X DELETE http://localhost:3000/api/token/53451fccede2004698000001
		OK

		curl http://localhost:3000/api/token/
		[]

- 15:05 - 15:35 - "hello world!" in browser console from backbone with simple router on frontend
- 15:45 - 16:00 - bootstrap with less for CMS
- 16:15 - 17:00 - working collection fetching and template views in backbone

#10/04/2014
5:35 total

- 10:15 - 11:00 - basic token displaying in cms view
- 11:10 - 11:30 - can add and remove tokens from cms view
- 11:35 - 12:05 - working token name editing in cms
- 12:20 - 13:05 - initial questions editing
- 15:35 - 16:05 - ability to add and remove tokens from questions in cms
- 16:05 - 16:40 - fixes for cms (was braking on renaming tokens in questions)
- 18:30 - 19:35 - properly working cms for game, questions and tokens, all that's left is wiring it all together
- 19:50 - 20:45 - fighting with bug when removing questions from game, hopefull with success
- 20:45 - 20:55 - add question from list of existing into the game

#11/04/2014
3:20 total

- 10:45 - 11:45 - more bug squashing, almost fully functioning cms
- 11:55 - 13:25 - hopefully all bugs squeshed, I forgot how painful was administering child views in backbone;
                  also added ability to add new questions and tokens from game cms, and add impact by those questions on tokens,
                  CMS isn't pretty but get's the job done, and I can finally start focusing on frontned
- 13:30 - 14:05 - all bugs squashed, finally on the right track...
- 15:15 - 15:30 - added yes/no impact to tokens

#13/04/2014
3:50 total

- 15:00 - 15:10 - final cms bug fixes (hopefully)
- 15:10 - 15:30 - initial game view
- 15:45 - 17:00 - initial "blob"/radar chart reacting to answers
- 18:00 - 19:45 - working fronted without style
- 20:05 - 20:25 - simple frontend styling

#14/04/2014
1:10 total

- 10:00 - 10:25 - basic style and router redirection
- 10:30 - 11:15 - putting app on heroku
