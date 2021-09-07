import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Button from '@material-ui/core/Button';
export default function Friend(props) {

  const [path, setPath] = useState(`/target/${props.item.id}`)
  const [visible, setVisible] = useState(props.disableIt);
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
            <Image
              src={props.item.image_url}
              roundedCircle
              height="40px"
              width="40px"
            />
            &nbsp;
            {props.item.firstname} {props.item.lastname}
          </Link>
        </nav>
        {!props.disableIt&& (
          <Button type="submit" variant="contained" onClick={() => {
            props.handleAddFriend(props.item.id);
            setVisible(false);
          }}>Follow</Button>
          // <button
          //   className="mybuttonnn"
          //   onClick={() => {
          //     props.handleAddFriend(props.item.id);
          //     setVisible(false);
          //   }}
          // >
          //   Follow
          // </button>
        )}

        {(visible ||props.disableIt) && (
          <Button type="submit" variant="contained">Followed</Button>
        )}
      </div>
    );

}


