/**
 * @swagger
 * paths:
 *   /articles:
 *     get:
 *       tags: [
 *         Articles
 *        ]
 *       summary: Returns all articles
 *       responses:
 *         200:
 *           description: A successful response
 *           content: 
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     created:
 *                       type: string
 *                       format: date-time
 *                     updated:
 *                       type: string
 *                       format: date-time
 *                     user_id:
 *                       type: integer
 *                     description:
 *                       type: string
 * 
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *               
 *     post:
 *       tags: [
 *         Articles
 *        ]
 *       summary: Creates new article
 *       description: "Requires user to be authenticated: User ID who creates the article will be saved to database."
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 content:
 *                   type: string
 *       responses:
 *         204:
 *           description: A successful response
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         400:
 *           description: Bad Request
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                   detail:
 *                     type: string
 *         401:
 *           description: Unauthorized
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *
 *   /articles/{id}:
 *     get:
 *       tags: [
 *         Articles
 *        ]
 *       summary: Returns article by id
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Article ID
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         200:
 *           description: A successful response
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   created:
 *                     type: string
 *                     format: date-time
 *                   updated:
 *                     type: string
 *                     format: date-time
 *                   user_id:
 *                     type: integer
 *                   description:
 *                     type: string
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 * 
 *     patch:
 *       tags: [
 *         Articles
 *        ]
 *       summary: Modifies article by id
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Article ID
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 description:
 *                   type: string
 *       responses:
 *         204:
 *           description: A successful response
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         400:
 *           description: Bad Request
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                   detail:
 *                     type: string
 *         401:
 *           description: Unauthorized
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 * 
 *     delete:
 *       tags: [
 *         Articles
 *        ]
 *       summary: Deletes article by id
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Article ID
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         204:
 *           description: A successful response
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         401:
 *           description: Unauthorized
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 * 
 * 
 * 
 *   /comments:
 *     get:
 *       tags: [
 *         Comments
 *        ]
 *       summary: Returns all comments
 *       responses:
 *         200:
 *           description: A successful response
 *           content: 
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     created:
 *                       type: string
 *                       format: date-time
 *                     content:
 *                       type: string
 *                     article_id:
 *                       type: string
 *                     user_id:
 *                       type: integer
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 * 
 *     post:
 *       tags: [
 *         Comments
 *        ]
 *       summary: Creates new comment
 *       description: "Requires user to be authenticated: User ID who creates the comment will be saved to database."
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                 article_id:
 *                   type: integer
 *       responses:
 *         204:
 *           description: A successful response
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         400:
 *           description: Bad Request
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                   detail:
 *                     type: string
 *         401:
 *           description: Unauthorized
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 * 
 *   /comments/{article_id}:
 *     get:
 *       tags: [
 *         Comments
 *        ]
 *       summary: Returns comments by article id
 *       parameters:
 *         - name: article_id
 *           in: path
 *           description: Article ID
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         200:
 *           description: A successful response
 *           content: 
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     created:
 *                       type: string
 *                       format: date-time
 *                     content:
 *                       type: string
 *                     article_id:
 *                       type: string
 *                     user_id:
 *                       type: integer
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 * 
 *   /comments/{id}:
 *     delete:
 *       tags: [
 *         Comments
 *        ]
 *       summary: Deletes comment by id
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Comment ID
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         204:
 *           description: A successful response
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         401:
 *           description: Unauthorized
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 * 
 * 
 * 
 *   /users:
 *     get:
 *       tags: [
 *         Users
 *        ]
 *       summary: Returns all users
 *       description: Returns all users without showing password information
 *       responses:
 *         200:
 *           description: A successful response
 *           content: 
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     username:
 *                       type: string
 *                     created:
 *                       type: string
 *                       format: date-time
 *                     role:
 *                       type: string
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *   
 *   /users/login:
 *     post:
 *       tags: [
 *         Users
 *        ]
 *       summary: Login for user authentication
 *       description: "Sets token cookie to client. Minimum length for username and password: 8 characters"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         200:
 *           description: A successful response
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   id:
 *                     type: integer
 *   
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         400:
 *           description: Bad Request
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                   detail:
 *                     type: string
 *   
 *   /users/logout:
 *     get:
 *       tags: [
 *         Users
 *        ]
 *       summary: Logout for user authentication
 *       description: "Removes token cookie from client"
 *       responses:
 *         204:
 *           description: A successful response
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *   
 *   /users/{id}:
 *     get:
 *       tags: [
 *         Users
 *        ]
 *       summary: Returns user by id
 *       description: Returns user without showing password information
 *       parameters:
 *         - name: id
 *           in: path
 *           description: User ID
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         200:
 *           description: A successful response
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   username:
 *                     type: string
 *                   created:
 *                     type: string
 *                     format: date-time
 *                   role:
 *                     type: string'
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *   
 *     delete:
 *       tags: [
 *         Users
 *        ]
 *       summary: Deletes user by id
 *       parameters:
 *         - name: id
 *           in: path
 *           description: User ID
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         204:
 *           description: A successful response
 *   
 *   /users/register:
 *     post:
 *       tags: [
 *         Users
 *        ]
 *       summary: Creates new user
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         204:
 *           description: A successful response
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         400:
 *           description: Bad Request
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                   detail:
 *                     type: string
 *   
 *   /users/username/{id}:
 *     patch:
 *       tags: [
 *         Users
 *        ]
 *       summary: Changes username by id
 *       parameters:
 *         - name: id
 *           in: path
 *           description: User ID
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *       responses:
 *         204:
 *           description: A successful response
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         400:
 *           description: Bad Request
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                   detail:
 *                     type: string
 *   
 *   /users/password/{id}:
 *     patch:
 *       tags: [
 *         Users
 *        ]
 *       summary: Changes password by id
 *       parameters:
 *         - name: id
 *           in: path
 *           description: User ID
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 password:
 *                   type: string
 *       responses:
 *         204:
 *           description: A successful response
 *         500:
 *           description: Internal Server Error
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         400:
 *           description: Bad Request
 *           content: 
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                   detail:
 *                     type: string
 */