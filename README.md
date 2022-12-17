# Neighbour Needs
Neighbour Needs is a full stack MERN application (MongoDB, Express, React and Node) that allows users to find people in their neighbourhood who can help with anything from maths tutoring and interior design, to plumbing and therapy. This project was created by Ana Borges, Emily Daykin and Mohamed Mohamed in the span of just over a week. For a full list of this app's features, see the [Features](#features) section below.

**This repo contains code for the front end client only; code for the back end api lives [here](https://github.com/emilydaykin/Neighbour-Needs-API).**

## Installation
- Check out the live application [here](https://neighbour-needs.netlify.app/)!
  - Feel free to register and then use your own login credentials, or try a demo one using:
    - Username: `kc@user.com`
    - Password: `Password1!@`
- Or run it locally (make sure you have a local version of MongoDB running):
  - Front End: Clone this repo, &#8594; run `npm install` &#8594; run `npm run start:client`
  - [Back End](https://github.com/momoh66/ga-project3-api): Clone this repo &#8594; run `npm install` &#8594; run `npm run seed` &#8594; run `npm run start:server` 

## Application Walkthrough
### Home & About Pages
<p align="center">
  <img src="./src/images/home_page.png" width="46%"  />
  <img src="./src/images/about_page.png" width="49.4%"  />
</p>

### Sidebar, Welcome Banner & Login Page
<p align="center">
  <img src="./src/images/login_sidebar.png" width="48.2%"  />
  <img src="./src/images/sidebar_welcome.png" width="48%"  />
</p>

### Feed & Profiles Page
<p align="center">
  <img src="./src/images/feed_profiles_page.png" width="90%"  />
</p>

### Creating a New Post
<p align="center">
  <img src="./src/images/create_new_post.png" width="90%"  />
</p>

### Neighbourhoods & Services Pages
<p align="center">
  <img src="./src/images/neighbourhoods_page.png" width="48%"  />
  <img src="./src/images/services_page.png" width="48.1%"  />
</p>

### Individual and Filtered Profile Pages
<p align="center">
  <img src="./src/images/single_profile.png" width="37%"  />
  <img src="./src/images/services_filter_page.png" width="49.5%"  />
</p>

### Responsive Design
<p align="center">
  <img src="./src/images/responsiveness_feed_profiles.png" width="30%"  />
  <img src="./src/images/responsiveness_single_profile.png" width="29%"  />
  <img src="./src/images/responsiveness_register.png" width="36%"  />
</p>

## Tech Stack
### Front End
- React Framework (Single Page Application)
- API Handling: Axios
- Pure CSS with Sass
- React-Router-Dom

### Back End
- Server: Node.js & Express
- Database: MongoDB & Mongoose
- Safeguarding from injection attacks: Express Mongo Sanitize
- Password Encryption: Bcrypt
- Authentication: JSON Web Token (JWT)

### Collaboration & Development
- Git, GitHub
- Trello for project management
- Postman for API testing
- Excalidraw for wireframing
- Npm
- Deployment:
  - Front End: Netlify
  - Back End: ~~Heroku~~ Render (& Mongo Atlas)

## Features
- Display of all profiles, and routing to an individual profile page with more information and a comments area when clicked on
- Real time searching through all profiles by name, location, or service offered
- Minimalist top navbar with a more detailed slide-in-out sidebar
- Log In and Register functionality
- Once logged in:
  - A user icon appears in the navbar, as well as a personalised welcome banner, which redirects to the user's profile page
  - The user can create a post
  - The user can leave a comment on any profile
  - Only the same user who commented/posted can remove their comment and post, no one else's
- Filtering through service type or location via their respective pages

## Architecture:
- Front End: 
  - React Components to compartmentalise code
  - React Hooks for state management and handling side effects
  - Scss stylesheets per react component
  - Single Page Application (`react-router-dom`) using `Link`, `useNavigate`, `useLocation` and `useParams`
- Back End:
  - All security checks (user access credentials) done in the back end:
    - Email validation (correct format and uniqueness)
    - Password validation (encryption and strength: minimum of 8 characters, at least one lowercase & uppercase letter and number)
    - Obscuring the password response from the front end
    - Login credentials expire after 6 hours
  - Secure routing middelware to verify logged in users, same users (only that same user can delete their comment for example) and admin users
  - Error handling middleware to assist with debugging
  - 3 interlinked schema models in MongoDB for profiles, comments and posts
  - Data seeding of 25 user profiles, 15 comments and 3 posts.


## Featured Code Snippets
### Front End
#### New post pop-up (only when authenticated) using css `position: absolute`. User can also delete their posts only`.
```
const [createPostPopup, setCreatePostPopup] = useState(false);
const [newPostData, setNewPostData] = useState({
  text: '',
  service: '',
  urgency: ''
});

const createPostClicked = () => setCreatePostPopup(!createPostPopup);

function handlePostInputChange(e) {
  setNewPostData({ ...newPostData, [e.target.name]: e.target.value });
}
async function handleSubmitPost(e) {
  e.preventDefault();
  await createPost(newPostData);
  setNewPostData({ text: '', service: '', urgency: '' });
  setCreatePostPopup(!createPostPopup);
  getPostData();
}

async function handleDeletePost(postId) {
  await deletePost(postId);
  getPostData();
}
```

### Back End
#### Secure Route middleware to verify authentication and access rights
```
import jwt from 'jsonwebtoken';
import Profile from '../models/profile.js';
import { secret } from '../config/environment.js';

const secureRoute = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith('Bearer')) {
      return res
        .status(401)
        .send({ message: 'Unauthorised. Auth Token incorrect or does not exist' });
    } else {
      const token = authToken.replace('Bearer ', '');
      jwt.verify(token, secret, async (err, data) => {
        if (err) {
          return res.status(400).json({ message: "Unauthorised. JWT can't verify." });
        } else {
          const user = await Profile.findById(data.profileId);
          if (!user) {
            return res.status(401).json({ message: 'Unauthorised. User not in database' });
          } else {
            req.currentUser = user;
            next();
          }
        }
      });
    }
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorised' });
  }
};

export default secureRoute;

```
#### Interlinked profile and comments model schema
```
export const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, maxLength: 300 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdById: {
      type: mongoose.Schema.ObjectId,
      ref: 'Profile',
      required: true
    },
    createdByName: {
      type: String
    },
    createdBySurname: {
      type: String
    }
  },
  { timestamps: true }
);

const profileSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First name required'] },
  surname: { type: String, required: [true, 'Surname required'] },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    validate: (email) => emailRegex.test(email)
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: [8, 'Password must be a minimum of 8 characters'],
    validate: (password) => passwordRegex.test(password)
  },
  isHelper: { type: Boolean },
  averageRating: { type: String },
  services: { type: Array },
  bio: { type: String },
  city: { type: String, required: [true, 'City required'] },
  region: { type: String, required: [true, 'Region required'] },
  imageProfile: { type: String },
  imageService: { type: String },
  comments: [commentSchema],
  posts: { type: Array },
  isAdmin: { type: Boolean }
});
```

## Future Improvements & Bugs
If we'd had more time as a group, we would've loved to implement an edit profile function (where a user can edit their own profile, become a helper, add a bio etc), as well as messaging functionality where users can reach out to helpers to arrange appointments and request more information. One unsolved problem we had was registered a new user a helper: when a new user registers and fills out the services they can help out with, they don't get saved to the database as a helper.