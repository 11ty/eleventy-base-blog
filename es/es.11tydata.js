module.exports = {
  "lang": "es",
  "permalink": function(data) {
    // Slug override is set in the post for localized URL slugs
    // e.g. /es/blog/fourthpost.md will optionally write to
    //    /es/blog/cuarta-publicacion/ instead of /es/blog/fourth-post/
    if(data.slugOverride) {
      return `/${data.lang}/blog/${this.slugify(data.slugOverride)}/`;
    }
  }
}
