# SEO-friendly blog post application

This project is to create a fictional SaaS product called "BlogStandard".  BlogStandard allows users to create an account (handled by auth0), purchase tokens (handled by stripe), and spend those tokens to generate blog posts, powered by OpenAI's GPT API. User's tokens and generated blog posts will be stored using MongoDB.

Technlogies used: 
NextJS, ReactJS, OpenAI's GPT, MongoDB, Auth0, Stripe, and Tailwind CSS


## Prerequisites
- Node and npm needs to be installed in local machine
- You have to create free accounts for the following:
  - [ ] OpenAI (https://openai.com/blog/chatgpt)
  - [ ] MongoDB (https://account.mongodb.com/account/register)
  - [ ] Auth0 (https://auth0.com/)
  - [ ] Stripe (https://dashboard.stripe.com/login)


### Getting Started

1. Create a `env.local` file in the root directory. There is sample file for reference.
2. Make sure you store keys from each of the prerequisites in `/utils/env.local`.
3. To run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


