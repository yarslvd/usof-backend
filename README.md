# USOF API

API for question and answer service for professional and enthusiast programmers. The latter allows you to share your problems/solutions with short posts, receive solutions/feedback, or even increase your profile rating.

## Installation

1. Clone project:
```bash
git clone git@gitlab.ucode.world:connect-khpi/connect-fullstack-usof-backend/ydoroshenk.git   # For campus users
git clone git@github.com:yarslvd/usof-backend.git   # Github repo
```
2. In the folder run `npm install`
3. Go to the **database** folder and create a database with `mysql -u root -p < db.sql`
4. Insert the test data into your database with `mysql -u root -p < insert.sql`
5. Finally, run the server `node index.js`

## Usage
**To use the API properly, please, create a new user. If you try to log in with test data, you will get an error, because of the non-hashed password. This data is provided just for the test of different endpoints.**

## Creating account
1. Enter registration data with a valid email to the endpoint - `/api/auth/register`

![Entering data for sign up](https://i.imgur.com/q35eALw.png)

2. After sending the data you will receive an email with your verification link. Copy this link.

![Copying the verification link from the email](https://i.imgur.com/OdaNDvB.png)

3. Create a new POST request with endpoint `/api/auth/confirm/:token` and submit an email.

![Confirming email with Postman](https://i.imgur.com/MndrhNA.png)

4. Congratulations🥳, you have successfully created an account!

![Database info with new account](https://i.imgur.com/qf0V8e2.png)

5. There is one more thing to do. You have to obtain an admin role to use the admin panel. Simply update the table using `UPDATE users SET role='admin' WHERE id=your_id;`

![Showing admin role](https://i.imgur.com/kdpuu1a.png)

## List with all possible endpoints

**Authorization**
| Method | Endpoint | Description |
| :- | :-: | :- |
| **POST** | `/api/auth/register` | Registration of a new user, required parameters are [login, password, passwordRepeat, email, fullname] |
| **POST** | `/api/auth/confirm/:token` | Confirmation of your email |
| **POST** | `/api/auth/login` | Log into your account [login, password] |
| **POST** | `/api/auth/logout` | Log out from your account |
| **POST** | `/api/auth/password-reset` | Send a reset link to user email [email] |
| **POST** | `/api/auth/password-reset/:token` | Changing your password [password, confirmPassword] |

**User**
| Method | Endpoint | Description |
| :- | :-: | :- |
| **GET** | `/api/users` | Get all users |
| **GET** | `/api/users/:user_id` | Get specified user |
| **POST** | `/api/users` | Create a new user [login, password, passwordRepeat, email, fullname, role] |
| **PATCH** | `/api/users/avatar` | Upload user avatar [image] |
| **PATCH** | `/api/users/:user_id` | Update user data [login, fullname, password, passwordRepeat] |
| **DELETE** | `/api/users/:user_id` | Delete user |

**Posts**
| Method | Endpoint | Description |
| :- | :-: | :- |
| **GET** | `/api/posts` | Get all posts |
| **GET** | `/api/posts/:post_id` | Get specified post data |
| **GET** | `/api/posts/:post_id/comments` | Get all comments for the specified post |
| **POST** | `/api/posts/:post_id/comments` | Create a new comment [content] |
| **GET** | `/api/posts/:post_id/categories` | Get all categories associated with the specified post |
| **GET** | `/api/posts/:post_id/like` | Get all likes under the specified post |
| **POST** | `/api/posts/` | Create a new post [title, content, categories], categoris must be written like: [1, 2, 6] |
| **POST** | `/api/posts/:post_id/like` | Create a new like/dislike under a post [type] |
| **PATCH** | `/api/posts/:post_id` | Update the specified post [title, content, status] |
| **DELETE** | `/api/posts/:post_id` | Delete a post |
| **DELETE** | `/api/posts/:post_id/like` | Delete a post like/dislike |

**Category**
| Method | Endpoint | Description |
| :- | :-: | :- |
| **GET** | `/api/categories` | Get all categories |
| **GET** | `/api/categories/:category_id` | Get specified category data |
| **GET** | `/api/categories/:category_id/posts` | Get all posts associated with the specified category |
| **POST** | `/api/categories` | Create a new category [name] |
| **PATCH** | `/api/categories/:category_id` | Update specified category data |
| **DELETE** | `/api/categories/:category_id` | Delete a category |

**Comments**
| Method | Endpoint | Description |
| :- | :-: | :- |
| **GET** | `/api/comments/:comment_id` | Get specified comment data |
| **GET** | `/api/comments/:comment_id/like` | Get all likes under the specified comment |
| **POST** | `/api/comments/:comment_id/like` | Create a new like/dislike under a comment [type] |
| **PATCH** | `/api/comments/:comment_id` | Update specified comment data [content] |
| **DELETE** | `/api/comments/:comment_id` | Delete a comment |
| **DELETE** | `/api/comments/:comment_id/like` | Delete a like/dislike under a comment |

## Sorting and filters for `/api/posts`

**Sorting**
| Sort | Value | Description |
| :- | :-: | :-: |
| sort[rating] | *asc* | Sorting posts in ascending order of rating |
| sort[rating] | *desc* | Sorting posts in descending order of rating |
| sort[id] | *asc* | Sorting posts in ascending order of date |
| sort[id] | *desc* | Sorting posts in descending order of date |

**Filtering**
| Filter | Value | Description |
| :- | :-: | :-: |
| filter[dateTo] | *your_date* | Filtering all post to a given date |
| filter[dateFrom] | *your_date* | Filtering all post after a given date |
| filter[status] | *status* | Filtering all post according to status [active, inactive] |
| filter[category] | *category_id* | Filtering all post according to id of the category |

**Also server-side pagination is implemented, so you can write page and its value into params, pages start from 0**