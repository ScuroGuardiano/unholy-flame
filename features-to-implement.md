# Ficzery do zaimplementowania

## Basic

### Core
Core - that is viewing, creating, editing and deleting posts, authors, tags, categories, images.  
Aswell as editing privacy policy and about for the blog

## Filtering
Filtering on tables

### Lookups
Lookup table, when selecting for example category for my post I want to see table with categories as popover or something like that, where I'll be able to not only view and choose position from table but create new aswell! Of course lookups has to have sorting and filtering.

### POWERFUL Editing eXperience
And after that three things at the top I can create amazing editing experience with small improvements. For example there's no need to show tags table lookup. Instad I can just create field when I write tags manually and autocompletion list popup. If tag is not found I can show there message "Tag x not found" with a little button "Create tag x". I mean button "Create tag x" has to be on this autocomplete list anyway.

In my powerful editor I need very easy managing of assets too. Adding assets should be done by a modal, without ever needing to open /media tab.

> It'll be as power as fuckin' Children of Bodom's **_Are You Dead Yet_** album

### Nicolas Cache
Caching data from firestore is **mandatory**. As you pay for documents' reads you want to store as many data on local storage as it's possible. The ideal situation is where everything is readed from local storage and local storage loads data only once. Then it just update itself when admin adds, deletes or edits some document.

---
## POWERFUL Admin eXperience
You think only UX counts? What about AX?\* My goal in this project is to create **amazing _admin experience_**.
So there are few thing I have to do in order to achieve that. Besides **_POWERFUL EX_**\* of course.

### Home dashboard
Dashboard with charts and some analytics, ya know post views, top authors, top tags, top categories. Maybe some way to connect with Disqus if it's possible and Google Analitics, it's gonna be hard to do it in a good way but it's something that is needed if you want to manage a blog.

### Advanced filtering
I want to filter anything by anything it's related to. For example posts by tags, category, author, content in it, even fckn cover image. I want this thing to be as powerful as it's possible.

### Navigate like a boss
Navigation must be quick. Like very quick, if I am on tags table and I want to check posts that has specified tags I **MUST** be able to view that without leaving tag table, right? So I want context menu on every table from where I can open modal with view of any table that is related to original record. And I want that nested!

Kinda hard, so example:  
Let's assume I am on tag page and I want to check posts that has tag _angular_. So I right click on that record, context menu is shown, I click categories and modal is shown with categories table that belongs to posts that has selected tag. Then I click on category _Web dev_ with right-click and another context menu is shown. There I click posts and boom! Another modal pops out, this time with posts that belongs to that category. From there I can click edit on post _Powerful Admin Experience_ **AND I GOT ANOTHER MODAL** this time with post edit component, where I can edit post, save it. Close editing modal, close posts table modal, close categories modal and I am done. And I made all of this without even closing my tags.

## * - Glossary
* AX - Admin eXperience
* EX - Editing eXperience
