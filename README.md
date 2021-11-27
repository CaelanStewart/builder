# Builder
A modern, open source, TypeScript/Vue 3 (composition API) based, extensible and easy to use page builder, eventually to be implemented within a CMS.

## In development
This project is in the initial stages, and is nowhere near useful for anything... yet.

Let's see where this projects goes.

## Motivation
This is partially for practical purposes, as well as for personal entertainment. I can get a bit obsessive about quality, to the extent that I am capable of producing it, hence I'd like to begin development on a project such as this, in the way that I'd like to see it built.

I'd like to see a multi-purpose layout/page builder that satisfies the following constraints:
 - Is TypeScript based
 - Is Vue3-based (composition API)
 - Is easily extensible
 - Is easy to use, and has multiple editing modes (with the possibility of defining custom edit modes):
    - "text only editing" - which allows only changing text and imagery
    - "basic editing" - which allows basic editing/hiding/addition/removal of blocks
    - "advanced" - which allows full access to edit the layout, margins, paddings, responsiveness breakpoints, colours etc.
 - Permissions can be defined hierarchically for each and every element/option
 - Customisable responsiveness
 - Mobile-first, using Tailwind for the style framework
 - Deep integration into Tailwind's themeing and customisation options by runtime introspection of the Tailwind configuration
 - When it is eventually built into a CMS, it'd optimally support server-side rendering, whilst allowing interactive components to remain rendered in the browser
