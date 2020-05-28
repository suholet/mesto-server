# mesto-server
A REST API for the Mesto project.

## Users
Retrive all users' data
`GET /users`

Retrive user's data
`GET /users/:id`

Create user
`POST /users`

Update name and about
`PATCH /users/me`

Update avatar
`PATCH /users/me/avatar`

## Cards
Retrive all cards' data
`GET /cards`

Create card
`POST /cards`

Delete card
`DELETE /cards/:cardId`

Like card
`PUT /cards/:cardId/likes`

Dislike card
`DELETE /cards/:cardId/likes`
---
Project version 0.0.3.
