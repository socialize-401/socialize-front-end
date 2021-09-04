import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image';

export default function Friend(props) {
  const [path, setpath] = useState(`/target/${props.item.id}`);
  const targetProfile = () => {
    props.targetProfile(props.item.id);
  };
  return (
    <div className="personCont" key={props.item.id}>
      {/* {console.log('hello', props.item)} */}
      <nav>
        <Link
          className="personName"
          to={path}
          onClick={() => {
            targetProfile();
          }}
        >
          <Image src={props.item.image_url} roundedCircle height="40px" />
          &nbsp;
          {props.item.firstname} {props.item.lastname}
        </Link>
      </nav>
      <button
        className="mybuttonnn"
        onClick={() => props.handleAddFriend(props.item.id)}
      >
        Follow
      </button>
    </div>
  );
}
