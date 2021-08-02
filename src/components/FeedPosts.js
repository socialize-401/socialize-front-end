import React, { Component } from 'react'
import Post from './Post';
import CommentForm from './CommentForm';

export class Posts extends Component {

    render() {
        return (
            <div>
                {this.props.showPosts && this.props.allPosts.map((element, index) => {
                    return (
                        <div key={index}>

                            <Post
                                like={this.props.like}
                                postID={element.id}
                                comments={this.props.comments}
                                postContent={element.content} />
                            <CommentForm comment={this.props.comment} id={element.id} />
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Posts
