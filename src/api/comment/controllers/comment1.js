/**
 * MY OWN COMMENT CONTROLLERS:
 * POST
 * UPDATE
 * DELETE
 * COMMENT LIKE and DISLIKE
 */

module.exports = {
   /**
    * GET Methods:
    */
   async customPost(ctx) {
      const { user } = ctx.state;

      // Check if the request body contains valid JSON and data property
      if (
         !ctx.request.body ||
         typeof ctx.request.body !== 'object' ||
         !ctx.request.body.data
      ) {
         return ctx.badRequest(
            'Invalid JSON or missing "data" property in the request body.'
         );
      }

      // if logged in we allow the user to submit comment
      const submitComment = await strapi
         .documents('api::comment.comment')
         .create({
            data: {
               ...ctx.request.body.data,
               author: user.id,
            },
         });
      ctx.send({ msg: 'comment submitted', data: submitComment });
   },

   /**
    * PUT Methods:
    */
   async customUpdate(ctx) {
      const { user } = ctx.state;
      const { id } = ctx.params;

      // find the comment via comment id
      const comment = await strapi.documents('api::comment.comment').findOne({
         documentId: id,
         populate: '*',
      });

      if (!comment) {
         return ctx.notFound('Comment not found');
      }

      // Check if the request body contains valid JSON and data property
      if (
         !ctx.request.body ||
         typeof ctx.request.body !== 'object' ||
         !ctx.request.body.data
      ) {
         return ctx.badRequest(
            'Invalid JSON or missing "data" property in the request body.'
         );
      }

      // check if the user is the owner of the comment
      if (comment.author.id !== user.id) {
         return ctx.unauthorized(
            'You are not authorized to modify or delete information belonging to other users.'
         );
      } else {
         // update the comment
         const updatedComment = await strapi
            .documents('api::comment.comment')
            .update({
               documentId: id,
               data: ctx.request.body.data,
            });
         ctx.send({ msg: 'Comment Updated', data: updatedComment });
      }
   },

   /**
    * DELETE Methods
    */
   async customDelete(ctx) {
      const { user } = ctx.state;
      const { id } = ctx.params;

      // find the comment via comment id
      const comment = await strapi.documents('api::comment.comment').findOne({
         documentId: id,
         populate: '*',
      });

      if (!comment) {
         return ctx.notFound('Comment not found');
      }

      // check if the user is the owner of the comment
      if (comment.author.id !== user.id) {
         return ctx.unauthorized(
            'You are not authorized to modify or delete information belonging to other users.'
         );
      } else {
         // delete the comment
         const deletedComment = await strapi
            .documents('api::comment.comment')
            .delete({
               documentId: id,
            });
         ctx.send({ msg: 'Comment Deleted', data: deletedComment });
      }
   },

   /**
    * LIKE AND UNLIKE SYSTEM
    * POST METHODS:
    */

   async commentLike(ctx) {
      const { user } = ctx.state;
      const { id } = ctx.params;
      // populate the liked user for update and filter
      const findComment = await strapi
         .documents('api::comment.comment')
         .findOne({
            documentId: id,
            populate: ['likedBy'],
         });

      // filter:
      const alreadyLikedUser = findComment.likedBy.find(
         (likeUser) => likeUser.id
      );

      if (!alreadyLikedUser) {
         const likeToTheComment = await strapi
            .documents('api::comment.comment')
            .update({
               documentId: id,
               data: {
                  // @ts-ignore
                  likedBy: [...findComment.likedBy, user.id],
                  totalLikes: (findComment.totalLikes || 0) + 1,
               },
            });
         ctx.send({ msg: 'liked', data: likeToTheComment });
      }

      if (alreadyLikedUser) {
         const totalLike =
            findComment.totalLikes === null || findComment.totalLikes === 0
               ? findComment.totalLikes
               : (findComment.totalLikes || 0) - 1;

         const likeBy = findComment.likedBy.filter(
            (like) => like.id !== user.id
         );

         const unlikeToTheComment = await strapi
            .documents('api::comment.comment')
            .update({
               documentId: id,
               data: {
                  // @ts-ignore
                  likedBy: likeBy, // variable
                  totalLikes: totalLike, // variable
               },
            });
         ctx.send({ msg: 'liked', data: unlikeToTheComment });
      }
   },
};
