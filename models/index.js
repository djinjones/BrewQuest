const User = require('./User');
const BlogPost = require('./BlogPost');
const Comment = require('./Comment')

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

module.exports = { User, BlogPost, Comment };
