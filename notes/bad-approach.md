# Bad approach to modelling data

### The Mistake

I was using for my entire life only relational databases, so here in
document database I was doing things just like in relational. So I
created tags collection and each tag was individual document.

### The problem

I was lazy so when tag is added or deleted I was reloading data on the current table page. So it was like 10 docs reads every time I added or deleted tag, every visit of tags - 10 documents read, I want to move into another tags table page? Another 10 reads.

That's a lot of reads operations and that was only the beginning, with lookup tables and some other features it would be an enormous amount of docs reads.

### Not so good solution
I started thinking about implementing cache but it's not trivial when you're using query features like limiting, offset etc. Coz it's not optimal loading everything. And how to update pages, managing local cache which would be partial because I am loading only fragments of collection. I am sure I would do it but it could be a lot of code and still woundn't be as optimal (in terms of doc reads) as my better solution.

### The solution
So I understood my mistake, it's not SQL DB, let's take an advantage of document db:

Why do I need tag collection? Well I want to know how many tags I have and which tags I have, so I can list them on blog or something. Tags are so small, basically it's only slug and name so I don't need to create document per each tag right? I can just make one document with an array of tags in it and that would be all. I want to load all tags? One document read! The same I can do with categories. **And I can easily cache it.** Perfect!

But someone (me) would say:
* **"_It's not optimal loading whole tag list from base_"**  
  > Ye... but how heavy would be that tags? 100 tags maybe 4-5kB? Is that so much? I can load it all without any problem, store it in sessionStorage and **NEVER QUERY IT AGAIN** in current session. I can do all sorting, filtering etc. client-side without any read operations whatsoever. Even adding or deleting? I can send add or delete request to firestore and add/delete data in my cache **WITHOUT READING FROM FIRESTORE**. Simplicity dude.  
* **"_Cool but what if you had 10000 tags?_"**
  > Will there be 10000 tags? This project is mean for a **simple blog**, most prefferably single-author (although autors will be supported). **Not a professional CMS** for ultra blogging company with like 14436215 departments with 15415 authors in each. Remember about use case coz **why doing something that would have no sense in small scale, when project is meant for small scale.** Dude!

### Lesson to be learned
I learned lesson from this project to always think about use cases and what is the application purpose. I often forget about it thinking for example how it will scale when in fact it doesn't need to scale at all. Not everything has to scale.  
Not everything has to be optimal af, like when I have a function which has terribly unoptimized code but it executes in 2ms and it's called like only once every page load then I don't need to waste time optimizing it so it would run in 0.1ms. It's insignificant anyways, just a waste of time.
> Of couse if this function would be called for every element in 10000 elements array that would be a problem. Always think about what something was made for.
