const router = require('express').Router();
const { BlogPost } = require('../../models');


router.post('/', async (req, res) => {
 try {
    if (req.session.loggedIn) {
    const author = await req.session.username;
    
    const {title, content} = req.body;

    const newPostData = {
        title,
        content,
        author
    };

    const newPost =await BlogPost.create(newPostData);
    
    res.render('homepage', {
        newPost, loggedIn: req.session.loggedIn, showDeleteButton: false,
    })
    } else {
        res.render('login')
    }

 } catch (err) {
    res.status(500).json(err);
 }
});

router.delete('/:id', async (req, res) => {
try {
    if (req.session.loggedIn) {
    const deletePost = BlogPost.destroy({
        where: {
            id: req.params.id
        },
    });
    res.render('homepage', {
        deletePost, loggedIn: req.session.loggedIn,
    });
    } else {
        res.render('login');
    };

} catch (err) {
    res.status(500).json(err);
};
});

router.put('/:id', async (req, res) => {
    try {
        if (req.session.loggedIn) {
            const updatePost = await BlogPost.update(req.body, {
                where: {
                    id: req.params.id,
                },
            });
            res.render('homepage', {
                updatePost, loggedIn: req.session.loggedIn,
            });
        } else {
            res.render('login');
        };
    } catch (err) {
        res.status(500).json(err);
    };
});

module.exports = router;