import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Header from './components/Header';
import FeedPage from './components/FeedPage';
import Profile from './components/Profile';
import AddFriends from './components/AddFriends';
import CurrentGroup from './components/CurrentGroup';
import io from 'socket.io-client';
import Groups from './components/Groups';
import TargetProfile from './components/TargetProfile';
import 'bootstrap/dist/css/bootstrap.min.css';
import cookie from 'react-cookies';
import jwt from 'jsonwebtoken';

const SERVER_URL = 'localhost:5000/';
const socket = io(SERVER_URL, { transports: ['websocket'] });

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: {
        userID: null,
        firstname: null,
        lastname: null,
        gender: null,
        age: null,
        auth_id: null,
        image_url: null,
      },
      path: '/profile',
      allusers: [],
      allFollowing: [],
      showFollowing: false,
      allFollowers: [],
      showFollowers: false,
      posts: [],
      comments: [],
      showMessenger: false,
      messageReceiverId: null,
      allMessages: [],
      showMessages: false,
      allGroups: [],
      showGroups: false,
      GroupRequests: [],
      showGroupsRequests: false,
      showPosts: false,
      usergroups: [],
      showUsergroups: false,
      currentGroupPath: '',
      showCurrentGroupPath: false,
      currentGroupContent: [],
      showCurrentGroupContent: false,
      targetedProfileInfo: [],
      targetedFollowing: [],
      targetedFollowers: [],
      targetedPosts: [],
      groupPosts: [],
      showGroupPosts: false,
      currentGroupID: null,
      groupMembers: [],
      showGroupMembers: false,
      groupPostsLikes: [],
      showGroupPostsLikes: false,
      groupComments: [],
      showGroupComments: false,
    };
  }

  componentDidMount = async () => {
    const token = cookie.load('auth');
    if (token) {
      this.loggedIn(token);
      // const myCookie = cookie.load('auth');
      socket.emit('getAllPosts', { userID: token.id });
      socket.emit('getAllGroups', { userID: token.id });
      socket.emit('getUsergroups', { userID: token.id });
      socket.emit('getGroupRequests', { userID: token.id });
    }
    let currGroupID = localStorage.getItem('currentGroupId');
    if (currGroupID) {
      console.log('group id in curr', JSON.parse(currGroupID).groupId);
      socket.emit('getAllGroupPosts', {
        groupID: JSON.parse(currGroupID).groupId,
      });
    }




    socket.on('connect', () => {
      socket.emit('test');
      socket.emit('getAllUsers');
      socket.on('requestAccepted', (payload) => {
        // console.log(payload.ownerId);
        // console.log(payload.memberId);
        if (
          this.state.user.userID === payload.memberId ||
          this.state.user.userID === payload.ownerId
        ) {
          let userID = this.state.user.userID;
          socket.emit('getAllGroups', { userID: userID });
          socket.emit('getUsergroups', { userID: userID });
          socket.emit('getGroupRequests', { userID: userID });
        }
      });
      socket.on('newLike', () => {
        socket.emit('getAllPosts', { userID: this.state.user.userID });
      });
      socket.on('joinGroupRequest', (payload) => {
        if (this.state.user.userID === payload) {
          this.getGroupRequests();
        }
      });
      socket.on('groupisCreated', () => {
        let userID = this.state.user.userID;
        socket.emit('getAllGroups', { userID: userID });
        socket.emit('getUsergroups', { userID: userID });
      });
      socket.on('haveBeenFollowed', (payload) => {
        if (this.state.user.userID === payload) {
          this.getFollowers();
        }
      });
      socket.on('newGroupPostMade', (payload) => {
        console.log('currentGroupID ', this.state.currentGroupID);
        console.log('payload ', payload);
        if (this.state.currentGroupID === payload) {
          socket.emit('getAllGroupPosts', {
            groupID: this.state.currentGroupID,
          });
        }
      });
      socket.on('targetInfo', (payload) => {
        this.setState({
          targetedProfileInfo: payload[0],
        });
        // console.log(this.state.targetedProfileInfo);
      });
      socket.on('targetFollowing', (payload) => {
        this.setState({
          targetedFollowing: payload,
        });
        // console.log(this.state.targetedFollowing);
      });
      socket.on('targetFollowers', (payload) => {
        this.setState({
          targetedFollowers: payload,
        });
        // console.log(this.state.targetedFollowers);
      });
      socket.on('targetPosts', (payload) => {
        this.setState({
          targetedPosts: payload,
        });
        // console.log(this.state.targetedPosts);
      });
      socket.on('newUsersList', () => {
        socket.emit('getAllUsers');
      });
    });

    // socket.on('newuser',()=>{
    //   socket.emit('getAllUsers');
    // })
    socket.on('returnAllUsers', (data) => {
      this.setState({
        allusers: data,
      });
      // console.log(this.state.allusers);
    });

    socket.on('returnFollowing', (data) => {
      let data2 = data;
      // console.log(data);
      this.setState({
        allFollowing: data2,
        showFollowing: true,
      });
      console.log('following', this.state.allFollowing);
    });

    socket.on('returnFollowers', (data) => {
      let data2 = data;
      // console.log(data);
      this.setState({
        allFollowers: data2,
        showFollowers: true,
      });
      console.log('followers', this.state.allFollowers);
    });

    socket.on('returnMessages', (returnedMessages) => {
      let messages = returnedMessages;
      // console.log(data);
      this.setState({
        allMessages: messages,
        showMessages: true,
      });
      console.log('messages', this.state.allMessages);
    });

    socket.on('returnAllGroups', (returnedGroups) => {
      // let groups = returnedGroups;
      // console.log('before',groups);
      this.setState({
        allGroups: returnedGroups,
        showGroups: true,
      });
      // console.log('groups', this.state.allGroups);
    });

    socket.on('returnGroupRequests', (returnedGroupRequests) => {
      let GroupRequests = returnedGroupRequests;
      // console.log('hi');
      this.setState({
        GroupRequests: GroupRequests,
        showGroupsRequests: true,
      });
      console.log('GroupRequests', GroupRequests);
    });

    socket.on('returnUsergroups', (data) => {
      let usergroups = data;
      // console.log('usergroups', usergroups);
      this.setState({
        usergroups: usergroups,
        showUsergroups: true,
      });
      console.log('usergroups', this.state.usergroups);
    });

    socket.on('returnGroupMembers', (data) => {
      let groupMembers = data;
      this.setState({
        groupMembers: groupMembers,
        showGroupMembers: true,
      });
      console.log('usergroups', this.state.usergroups);
    });

    socket.on('returnCurrentGroupContent', (data) => {
      let currentGroupContent = data;
      // console.log('usergroups', usergroups);
      this.setState({
        currentGroupContent: currentGroupContent,
        showCurrentGroupContent: true,
      });
      console.log('currentGroupContent', this.state.currentGroupContent);
    });

    socket.on('error', (payload) => {
      console.log(payload);
    });

    //-----requesting to get the post from the server-----//

    //---requestin to get the comments from the server---//
    socket.emit('getAllComments', { userID: this.state.user.userID });

    //-------getting the posts from the server-------//
    socket.on('read', (payload) => {
      let stuff = payload;
      this.setState({
        posts: stuff,
        showPosts: true,
      });
      console.log('this is the read ', this.state.posts.length);
    });

    //------getting the comments from the server------//
    socket.on('readComments', (payload) => {
      this.setState({
        comments: payload,
      });
    });

    socket.on('commentCreated', () => {
      socket.emit('getAllComments', { userID: this.state.user.userID });
    });


    socket.on('returnGroupComments', (payload) => {
      this.setState({
        groupComments: payload,
        showGroupComments: true,
      });
      console.log('returned comments payload', payload);
    });

    //------notification of a new post ------//
    socket.on('newPost', () => {
      socket.emit('getAllPosts', { userID: this.state.user.userID });
    });

    socket.on('returnNewGroupPost', (data) => {
      let groupPosts = data;
      console.log('groupPosts', groupPosts);
      this.setState({
        groupPosts: groupPosts,
        showGroupPosts: true,
      });
      console.log('groupPosts', this.state.groupPosts);
    });

    socket.on('returnGroupLikes', (payload) => {
      let info = payload;
      // console.log('what is this', payload);
      socket.emit('getAllGroupPosts', { groupID: info[0].g_groups_id });
    });
  };

  getAllGroupPosts = (data) => {
    // console.log('this is data: ', data);
    socket.emit('getAllGroupPosts', { groupID: data });
  };

  getAllGroupComments = () => {
    socket.emit('getAllGroupComments');
  };

  getGroupMembers = (data) => {
    socket.emit('getGroupMembers', { groupID: data });
  };

  getFollowing = () => {
    let userID = this.state.user.userID;
    socket.emit('getFollowing', { userID: userID });
  };

  // getFollowing = () => {
  //   let userID = this.state.user.userID;
  //   socket.emit('getFollowing', { userID: userID });
  // };

  getFollowers = () => {
    let userID = this.state.user.userID;
    socket.emit('getFollowers', { userID: userID });
  };

  getGroupRequests = () => {
    let userID = this.state.user.userID;
    socket.emit('getGroupRequests', { userID: userID });
  };

  getUsergroups = () => {
    let userID = this.state.user.userID;
    socket.emit('getUsergroups', { userID: userID });
  };

  getAllGroups = () => {
    let userID = this.state.user.userID;
    socket.emit('getAllGroups', { userID: userID });
  };

  loggedIn = (token) => {
    try {

      const user = jwt.decode(token.token);
      console.log('user', user)
      if (user) {
        cookie.save('auth', token, { path: '/' });
        this.setState({
          loggedIn: true,
          user: {
            userID: token.id,
            firstname: user.user.firstname,
            lastname: user.user.lastname,
            age: user.user.age,
            gender: user.user.gender,
            auth_id: user.user.auth_id,
            image_url: user.user.image_url,
          },
        });
        this.setState({
          path: `/profile/${this.state.user.userID}`,
        });
      }
    } catch (error) {
      this.logOut();
    }

    // console.log('user', user);
    let payload = {
      userID: this.state.user.userID,
    };
    socket.emit('getAllPosts', { userID: this.state.user.userID });
    socket.emit('getNewUsersList');
    // console.log(this.state.posts);
    // socket.emit('join', { userID: this.state.user.userID });
    // console.log('user', this.state.path, this.state.user);
  };

  logOut = () => {
    this.setState({
      loggedIn: false,
      user: {}
    });
    cookie.save('auth', null, { path: '/' });
  };

  handleAddFriend = (reciverId) => {
    console.log('following...');
    let data = { reciverId: reciverId, senderId: this.state.user.userID };
    console.log(data);
    socket.emit('addFriend', data);
    this.getFollowing();
    this.getFollowers();
    socket.on('friendAdded', () => {
      socket.emit('getAllPosts', { userID: this.state.user.userID });
    });
    // socket.emit('joinFollowRoom', { reciverId });
    // socket.emit('getAllPosts', { userID: this.state.user.userID });
  };

  handleShowMessenger = (reciverId) => {
    this.setState({
      showMessenger: true,
      messageReceiverId: reciverId,
    });

    let room;
    if (reciverId > this.state.user.userID) {
      room = `${this.state.user.userID}_${reciverId}`;
    } else {
      room = `${reciverId}_${this.state.user.userID}`;
    }
    let payload = {
      messageRoomId: room,
    };

    socket.emit('returnAllMessages', payload);
  };

  handleSendMessage = (messageContent) => {
    let room;
    if (this.state.messageReceiverId > this.state.user.userID) {
      room = `${this.state.user.userID}_${this.state.messageReceiverId}`;
    } else {
      room = `${this.state.messageReceiverId}_${this.state.user.userID}`;
    }
    let payload = {
      messageContent: messageContent,
      receiverId: this.state.messageReceiverId,
      senderId: this.state.user.userID,
      messageRoomId: room,
    };
    console.log('message payload', payload);
    socket.emit('sendMessage', payload);
  };

  handleCreateGroup = (groupName, groupDescription) => {
    let payload = {
      group_name: groupName,
      group_owner: this.state.user.userID,
      group_description: groupDescription,
    };
    socket.emit('createGroup', payload);
    // this.getAllGroups();
    // this.getUsergroups();
  };

  handleJoinGroup = async (groupId, owner_id) => {
    let payload = {
      groupId: groupId,
      senderId: this.state.user.userID,
      owner_id: owner_id,
    };
    socket.emit('joinGroup', payload);
    this.getGroupRequests();
  };

  handleAcceptJoinGroup = (groupId, memberId, owner_id) => {
    let payload = {
      groupId: groupId,
      memberId: memberId,
      ownerId: owner_id,
    };
    socket.emit('acceptJoinGroup', payload);
    // console.log('accept pressed');
    // this.getGroupRequests();
  };

  handleViewgroup = (groupId) => {
    let payload = {
      groupId: groupId,
    };
    let currID = localStorage.setItem('currentGroupId', JSON.stringify({ groupId }));
    console.log('curr id: ', currID);

    this.setState({
      currentGroupID: groupId,
      currentGroupPath: `/groups/${groupId}`,
      showCurrentGroupPath: true,
    });
    socket.emit('viewGroup', payload);
    // console.log(payload);
    // this.getGroupRequests();
  };

  groupPostLike = (postId, groupId) => {
    let payload = {
      postId: postId,
      userId: this.state.user.userID,
      groupId: groupId,
    };
    socket.emit('groupPostLike', payload);
  };

  //-----sending the post to the server-----//
  post = (postContent, imageUrl) => {
    let payload = {
      postContent: postContent,
      imageUrl: imageUrl,
      userID: this.state.user.userID,
      poster_image_url: this.state.user.image_url,
      name: `${this.state.user.firstname} ${this.state.user.lastname}`,
    };
    console.log(payload);
    socket.emit('post', payload);
  };

  handelGroupPost = (postContent, imageUrl, groupID) => {
    let payload = {
      postContent: postContent,
      userID: this.state.user.userID,
      groupID: groupID,
      imageUrl: imageUrl,
    };
    console.log('groupPost', payload);
    socket.emit('groupPost', payload);
  };

  //----sending the comment to the server----//
  comment = (commentContent, post_id) => {
    let payload = {
      content: commentContent,
      post_id: post_id,
      userID: this.state.user.userID,
      commenter_image_url: this.state.user.image_url,
      name: `${this.state.user.firstname} ${this.state.user.lastname}`,
    };
    socket.emit('comment', payload);
  };

  handleGroupComment = (commentContent, post_id) => {
    let payload = {
      content: commentContent,
      postId: post_id,
      userId: this.state.user.userID,
    };
    // console.log('hello from group comment',payload);
    socket.emit('groupComment', payload);
  };
  //-----target getting info of the target profile from BE-----//
  targetProfile = (id) => {
    socket.emit('getTargetInfo', id);
    socket.emit('getTargetFollowing', id);
    socket.emit('getTargetFollowers', id);
    socket.emit('getTargetPosts', id);
  };
  //----updating the post like-----//
  like = (id) => {
    socket.emit('like', id);
  };
  render() {
    return (
      <Router>
        <Header path={this.state.path} logOut={this.logOut} />
        <div>
          <Switch>
            <Route exact path="/">
              <Home
                logOut={this.logOut}
                loggedIn={this.state.loggedIn}
                loggedInFunction={this.loggedIn}
              />
              {this.state.loggedIn && this.state.path && (
                <Redirect to="/feedPage" />
              )}
            </Route>
            <Route exact path="/feedPage">
              {
                <FeedPage
                  showPosts={this.state.showPosts}
                  userID={this.state.user.userID}
                  like={this.like}
                  comments={this.state.comments}
                  comment={this.comment}
                  allPosts={this.state.posts}
                  post={this.post}
                  logOut={this.logOut}
                />
              }
            </Route>
            <Route exact path={this.state.path}>
              {this.state.path && (
                <Profile
                  showPosts="/profile/:id"
                  userID={this.state.user.userID}
                  getFollowing={this.getFollowing}
                  getFollowers={this.getFollowers}
                  allFollowing={this.state.allFollowing}
                  allFollowers={this.state.allFollowers}
                  user={this.state.user}
                  showFollowing={this.state.showFollowing}
                  showFollowers={this.state.showFollowers}
                  like={this.like}
                  comments={this.state.comments}
                  comment={this.comment}
                  allPosts={this.state.posts}
                  post={this.post}
                  handleShowMessenger={this.handleShowMessenger}
                  showMessenger={this.state.showMessenger}
                  messageReceiverId={this.state.messageReceiverId}
                  handleSendMessage={this.handleSendMessage}
                  allMessages={this.state.allMessages}
                  showMessages={this.state.showMessages}
                  getUsergroups={this.getUsergroups}
                  comment={this.comment}
                  loggedIn={this.state.loggedIn}
                />
              )}
            </Route>
            <Route exact path="/addFriends">
              <AddFriends
                targetProfile={this.targetProfile}
                allusers={this.state.allusers}
                handleAddFriend={this.handleAddFriend}
                userID={this.state.user.userID}
              />
            </Route>
            <Route exact path="/groups">
              <Groups
                handleCreateGroup={this.handleCreateGroup}
                handleJoinGroup={this.handleJoinGroup}
                getAllGroups={this.getAllGroups}
                allGroups={this.state.allGroups}
                showGroups={this.state.showGroups}
                getGroupRequests={this.getGroupRequests}
                GroupRequests={this.state.GroupRequests}
                showGroupsRequests={this.state.showGroupsRequests}
                handleAcceptJoinGroup={this.handleAcceptJoinGroup}
                getUsergroups={this.getUsergroups}
                usergroups={this.state.usergroups}
                showUsergroups={this.state.showUsergroups}
                handleViewgroup={this.handleViewgroup}
                currentGroupPath={this.state.currentGroupPath}
                showCurrentGroupPath={this.state.showCurrentGroupPath}
              />
            </Route>
            <Route exact path="/groups/:id">
              <CurrentGroup
                currentGroupContent={this.state.currentGroupContent}
                showCurrentGroupContent={this.state.showCurrentGroupContent}
                post={this.handelGroupPost}
                groupPosts={this.state.groupPosts}
                showGroupPosts={this.state.showGroupPosts}
                getAllGroupPosts={this.getAllGroupPosts}
                currentGroupID={this.state.currentGroupID}
                getGroupMembers={this.getGroupMembers}
                showCurrentGroupPath={this.state.showCurrentGroupPath}
                groupMembers={this.state.groupMembers}
                showGroupMembers={this.state.showGroupMembers}
                groupPostLike={this.groupPostLike}
                groupPostsLikes={this.state.groupPostsLikes}
                comment={this.handleGroupComment}
                groupComments={this.state.groupComments}
                showGroupComments={this.state.showGroupComments}
                getAllGroupComments={this.getAllGroupComments}
              />
            </Route>
            <Route exact path="/target/:id">
              <TargetProfile
                targetedProfileInfo={this.state.targetedProfileInfo}
                targetedFollowing={this.state.targetedFollowing}
                targetedFollowers={this.state.targetedFollowers}
                targetedPosts={this.state.targetedPosts}
              />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
