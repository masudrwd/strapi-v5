/**
 * MY OWN CUSTOM COMMENT ROUTES:
 * POST
 * UPDATE
 * DELETE
 * COMMENT LIKE AND DISLIKE
 */

module.exports = {
   routes: [
      {
         method: 'POST',
         path: '/comment',
         handler: 'comment1.customPost',
         config: {},
      },
      {
         method: 'PUT',
         path: '/comment/:id',
         handler: 'comment1.customUpdate',
         config: {},
      },
      {
         method: 'DELETE',
         path: '/comment/:id',
         handler: 'comment1.customDelete',
         config: {},
      },
      {
         method: 'PUT',
         path: '/comment/:id/like',
         handler: 'comment1.commentLike',
         config: {},
      },
   ],
};
