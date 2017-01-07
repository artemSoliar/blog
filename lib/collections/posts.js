Posts = new Mongo.Collection('posts');

Posts.allow({
  update(userId, post) {
    return ownsDocument(userId, post);
  },
  remove(userId, post) {
    return ownsDocument(userId, post);
  },
});

Posts.deny({
  update(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

Posts.deny({
  update(userId, post, fieldNames, modifier) {
    let errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

validatePost = function(post) {
  let errors = {};

  if (!post.title)
    errors.title = "Please fill in a headline";

  if (!post.url)
    errors.url = "Please fill in a URL";

  return errors;
}

Meteor.methods({
  postInsert(postAttributes) {
    check(this.userId, String);
    check(postAttributes, {
      title: String,
      url: String
    });

    let errors = validatePost(postAttributes);
    if (errors.title || errors.url)
      throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");

    let postWithSameLink = Posts.findOne({
      url: postAttributes.url
    });
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    let user = Meteor.user();
    let post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0
    });

    let postId = Posts.insert(post);

    return {
      _id: postId
    };
  },

  upvote(postId) {
    check(this.userId, String);
    check(postId, String);

    let affected = Posts.update({
      _id: postId,
      upvoters: {
        $ne: this.userId
      }
    }, {
      $addToSet: {
        upvoters: this.userId
      },
      $inc: {
        votes: 1
      }
    });

    if (!affected)
      throw new Meteor.Error('invalid', "You weren't able to upvote that post");
  }
});