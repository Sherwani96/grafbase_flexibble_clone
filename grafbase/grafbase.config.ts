import { graph, auth, config } from '@grafbase/sdk'

// Welcome to Grafbase!
//
// Configure authentication, data sources, resolvers and caching for your GraphQL API.

const g = graph.Standalone();

// @ts-ignore
const User = g.model('User', {
  name: g.string().length({ min:2, max: 100 }),
  email: g.string().unique(),
  avatarurl: g.url(),
  description: g.string().length({ min:2, max:1000 }).optional(),
  githuburl: g.url().optional(),
  linkedinurl: g.url().optional(),
  projects: g.string().list().optional()
}).auth((rules: any) => {
  rules.public().read()
})

// @ts-ignore
const  Project = g.model('Project', {
  title: g.string().length({ min:3 }),
  description: g.string(),
  image: g.url(),
  livesiteurl: g.url(),
  githuburl: g.url(),
  category: g.string().search(),
  createdBy: g.string().list().optional()
}).auth((rules:any) => {
  rules.public().read()
  rules.private().create().delete().update()
})

const jwt = auth.JWT({
  issuer: 'grafbase',
  secret: g.env('NEXTAUTH_SECRET')
})

export default config({
  graph: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private()
  }
})

