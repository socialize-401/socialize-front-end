import React, { Component,useEffect,useState } from 'react';

export function CommentForm(props){
const [content, setContent] = useState('');

  const comment = (e) => {
    e.preventDefault();
    props.comment(content, props.id);
  };
 
    return (
      <div>
        <form
          className="commentForm"
          onSubmit={(e) => {
            comment(e);
          }}
        >
          <input
            required
            placeholder="type your comment here"
            type="text"
            onChange={(e) => {
              
               setContent(e.target.value);
 
            }}
          />
          <input className="mybuttonnn" type="submit" value="comment" />
        </form>
      </div>
    );

}

export default CommentForm;
