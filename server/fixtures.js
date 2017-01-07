// Fixture data 
if (Posts.find().count() === 0) {
  let now = new Date().getTime();
  
  // create two users
  let artemId = Meteor.users.insert({
    profile: { name: 'Artem Soliar' }
  });
  let artem = Meteor.users.findOne(artemId);
  let antonId = Meteor.users.insert({
    profile: { name: 'Anton Velichko' }
  });
  let anton = Meteor.users.findOne(antonId);
  
  let topId = Posts.insert({
    title: 'Top 7 JavaScript frameworks for efficient front-end development',
    userId: anton._id,
    author: anton.profile.name,
    url: 'https://www.linkedin.com/pulse/top-7-javascript-frameworks-efficient-front-end-andriy-davydenko',
    submitted: new Date(now - 7 * 3600 * 1000),
    commentsCount: 2,
    upvoters: [], votes: 0
  });
  
  Comments.insert({
    postId: topId,
    userId: artem._id,
    author: artem.profile.name,
    submitted: new Date(now - 5 * 3600 * 1000),
    body: 'Interesting top list anton, can I get involved?'
  });
  
  Comments.insert({
    postId: topId,
    userId: anton._id,
    author: anton.profile.name,
    submitted: new Date(now - 3 * 3600 * 1000),
    body: 'You sure can artem!'
  });
  
  Posts.insert({
    title: 'Meteor',
    userId: artem._id,
    author: artem.profile.name,
    url: 'http://meteor.com',
    submitted: new Date(now - 10 * 3600 * 1000),
    commentsCount: 0,
    upvoters: [], votes: 0
  });
  
  Posts.insert({
    title: 'The Meteor Book',
    userId: artem._id,
    author: artem.profile.name,
    url: 'http://themeteorbook.com',
    submitted: new Date(now - 12 * 3600 * 1000),
    commentsCount: 0,
    upvoters: [], votes: 0
  });
  
  for (let i = 0; i < 10; i++) {
    Posts.insert({
      title: 'Test post #' + i,
      author: anton.profile.name,
      userId: anton._id,
      url: 'http://google.com/?q=test-' + i,
      submitted: new Date(now - i * 3600 * 1000 + 1),
      commentsCount: 0,
      upvoters: [], votes: 0
    });
  }
}