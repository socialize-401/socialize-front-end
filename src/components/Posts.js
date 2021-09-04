import React from 'react';
import Post from './Post';
import CommentForm from './CommentForm';

function Posts(props) {
  return (
    <div>
    {/* {console.log('hi', this.props.allPosts)} */}
    {props.allPosts.map((element, index) => {
      if (element.poster_id === props.userID) {
        return (
          <div className="postDiv" key={index}>
            <Post
              post_likes={element.likes}
              post_time={element.send_time}
              poster_name={element.poster_name}
              like={props.like}
              postID={element.id}
              comments={props.comments}
              postContent={element.content}
              comment={props.comment}
              id={element.id}
              image_url={element.image_url}
              poster_image_url={element.poster_image_url}
            />
          </div>
        );
      }
    })}
  </div>
  )
}

export default Posts



// export class Posts extends Component {
//   render() {
//     return (
//       <div>
//         {/* {console.log('hi', this.props.allPosts)} */}
//         {this.props.allPosts.map((element, index) => {
//           if (element.poster_id === this.props.userID) {
//             return (
//               <div className="postDiv" key={index}>
//                 <Post
//                   post_likes={element.likes}
//                   post_time={element.send_time}
//                   poster_name={element.poster_name}
//                   like={this.props.like}
//                   postID={element.id}
//                   comments={this.props.comments}
//                   postContent={element.content}
//                   comment={this.props.comment}
//                   id={element.id}
//                   image_url={element.image_url}
//                   poster_image_url={element.poster_image_url}
//                 />
//               </div>
//             );
//           }
//         })}
//       </div>
//     );
//   }
// }

// export default Posts;
