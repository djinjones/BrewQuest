const User = require('./User');
const BlogPost = require('./BlogPost');
const Comment = require('./Comment');
const Brewery = require('./Brewery')

User.hasMany(BlogPost, {
  foreignKey: 'author',
  onDelete: 'CASCADE',
});

BlogPost.belongsTo(User, {
  foreignKey: 'author'
});

BlogPost.hasMany(Comment, {
  foreignKey: 'postId',
  onDelete: 'CASCADE',
});

Comment.belongsTo(Comment, {
  foreignKey: 'postId'
});

User.hasMany(Comment, {
  foreignKey: 'username',
  onDelete: 'CASCADE',
});

Comment.belongsTo(User, {
  foreignKey: 'username',
});

Brewery.hasMany(BlogPost, {
  as: 'blogs',
  foreignKey: 'brewery_id',
  onDelete: 'CASCADE',
});

BlogPost.belongsTo(Brewery, {
  foreignKey: 'brewery_id',
});

module.exports = { User, BlogPost, Comment, Brewery };
