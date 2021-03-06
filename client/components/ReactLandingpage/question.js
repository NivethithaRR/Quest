import React  from 'react';
import Moment from 'react-moment';
import {Link,Redirect} from 'react-router-dom';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import {Row,Col} from 'react-flexbox-grid';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Divider from 'material-ui/Divider';
import {grey900,indigo900,tealA700,blue300,cyan500,grey50,redA700,lightGreen900,deepOrange300,purple500} from 'material-ui/styles/colors.js';
import IndividualQuestion from './individualquestion.js';
import Postanswer from './postAnswer.js';
import './reactlandingpage.css';
import Cookies from 'universal-cookie';


const cookies = new Cookies();
const styles = {
  col1:{
    textAlign: 'center',
    whiteSpace:'inherit',
    fontFamily: 'Roboto !important',
    fontSize:'120%',
    color:'grey',
    overflow: 'visible'
  },
  col2:{
    textAlign: 'center',
    whiteSpace:'inherit',
    fontFamily: 'Roboto',
    fontSize:'120%',
    color:'grey',
    overflow: 'visible',
  },
  col3:{
    fontFamily: 'Roboto',
    fontSize:'110%',
    color:'grey',
    overflow: 'visible'
  },
  col4:{
      overflow: 'visible',
      paddingTop:'3%',
      width:'100%'
  },
  col5:{
      overflow: 'visible',
      paddingTop:'-1%'
  },
  followBtn:{
    overflow:'visible',
    color:'black',
    paddingTop:'2%',
    color:'grey'
  },
  submitbtn:{
    width:'50%',
    fontFamily: 'Roboto',
    marginLeft:'25%'
  },
  paper:{
    width:'80%',
    marginLeft:'10%',
    marginTop:'2%',
    marginBottom:'2%',
    marginRight:'10%',
    overflow:'visible',
    overflowWrap:'break-word'
  },
  badge:{
    marginTop:'5%',
    padding: '10px 10px 2px 2px'
  },
  unfollowBtn:{
    overflow:'visible',
    color:'grey',
    paddingTop:'2%',
    color:'grey'
  },
  showBtn:{
    width:'20%',
    height:'20%',
  }
};

var user = cookies.get('displayname');
var token = cookies.get('token');
export default class Question extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        noAnswers:'',
        answers:'',
        answers1:'',
        dialog:'',
        openAnswer: false,
        openAnswer1:false,
        buttonStatus:true,
        displayAnswerCount:true,
        postButton:false,
        followBtn:true,
        button:false,
        followups:this.props.followCount,
        displayAnswer:false,
        user:null,
        firstletter:'',
        followSuccess:'',
        postanswers:'',
        token:null,
        btnStatus:false,
        picture: this.props.picture,
        showAnswer:false,
        showAnswerBtn:true,
        profileImg:true,
        redirect:false
      };

    }
    componentWillMount(){
      this.setState({token:token});
      if(this.props.picture != undefined) {
        this.setState({picture:this.props.picture});
      }
      if(token != null){
        this.setState({btnStatus:true});
      }

      if(this.props.picture == "profile.jpg"){
        this.setState({profileImg:false})
      }

    if((this.props.followCount)<=1){
      this.setState({follower:'follower'});
    }
    if((this.props.answerCount)<=1){
      this.setState({answer:'answer'});
    }

    else{
      this.setState({followups:this.props.followCount});
    }


    if(this.props.name == "unanswered"){
      this.setState({displayAnswerCount:false});
    }

    if(this.props.name == "userquestions"){
      console.log("inside userquestions");
    }

    var user = cookies.get('emailId');
    this.setState({user:user})
    if(user == null){
      this.setState({button:false});
    }
    else{
      this.setState({button:true});
    }
    /*to get firstletter of user name*/
    var avatar = this.props.postedBy;
    var image = avatar.substring(0,1);
    this.setState({firstletter:image});
    /* to get the logstatus */
    var that = this;
    $.ajax({
      type:'GET',
      url:'/followStatus',
      data:{user:user},
      success:function(data){
        data.map((row,index)=>{
            if(row.qid == that.props.qid){
              that.setState({followBtn:false});
            }
            else{
              that.setState({followBtn:true});
            }
          });
      },
      error:function(err){
        alert("error");
      }
    });

  }
  /* to get the post answer alert*/
  checkForPostAnswerAlert(){
        this.props.toaster.info(
          'Signin/SignUp to continue',
        '', {
          timeOut: 3000,
          extendedTimeOut: 3000
            }
      );
  }
/*getting  post answer functionality*/
  postAnswer(){
    this.setState({toasterCon:this.props.toaster});
    var qid = this.props.qid;
    if(this.state.token)
    {
      var answers = <Postanswer qid={qid} handleClose={this.handleClose.bind(this)} toaster={this.props.toaster}/>
      this.setState({openAnswer1:true,postanswers : answers});
    }
    else {
      this.checkForPostAnswerAlert();
    }

  }
  checkForFetchErrorAlert() {
      this.props.toaster.error(
        'No Answers',
      '', {
        timeOut: 3000,
        extendedTimeOut: 3000
          }
    );
    }
    checkForErrorPostAnswerAlert() {
        this.props.toaster.error(
          'No Answers',
        '', {
          timeOut: 3000,
          extendedTimeOut: 3000
            }
      );
      }

  fetchAnswer(){
    var that =this;
    var qid = that.props.qid;
    $.ajax({
    url:'/answer/'+qid,
    type:'GET',
    data:{},
    success:function(answers){
          var noAnswer;
          var answers;
          console.log(answers);
          if(answers == 'No answers!!!!!'){
            if(that.state.token){
                console.log("no answers");
                that.setState({openAnswer:true});
                noAnswer = <Postanswer qid={qid} toaster={that.props.toaster} handleClose={that.handleClose.bind(that)}/>
            }
            else{
              that.checkForErrorPostAnswerAlert();
            }
            that.setState({noAnswers : noAnswer});
          }
          else{
            that.setState({postButton:true,displayAnswer:true,showAnswer:true,showAnswerBtn:false});
            answers = answers.map((row,index)=> {
             return <IndividualQuestion answer={row.answer}  toaster={that.props.toaster} answered_by={row.answered_by} likes={row.likes} dislikes={row.dislikes} answerid={row.answerId} timestamp={row.time} picture={row.picture} key = {index}/>
           });
         }
        that.setState({answers : answers});
    },
    error:function(err){
        that.checkForFetchErrorAlert();
    }
    })
  }

  hideAnswer(){
    this.setState({showAnswer:false,showAnswerBtn:true})
  }

  handleClose(){
    this.setState({openAnswer: false,openAnswer1: false});
  }
  checkForFollowSuccessAlert() {
    this.props.toaster.success(
      'Successfully followed',
    '', {
      timeOut: 3000,
      extendedTimeOut: 3000
        }
  );
}
checkForFollowErrorAlert() {
  this.props.toaster.error(
    'Error while following',
  '', {
    timeOut: 3000,
    extendedTimeOut: 3000
      }
);
}
  followQuestion(){
    var that = this;
    var qid = this.props.qid;
    var followup=that.props.followCount+1;
    $.ajax({
      type:'POST',
      url:'/followQuestion/'+qid,
      data:{user:cookies.get('emailId')},
      success:function(data){
          that.setState({followBtn:false,followups:that.props.followCount+1});
        //  alert("follow success");
       var FollowSuccess= that.checkForFollowSuccessAlert();
      },
      error:function(err){
          thatcheckForFollowErrorAlert();
      }
      })
  }
  checkForUnFollowSuccessAlert() {
  this.props.toaster.warning(
      'Successfully unfollowed',
    '', {
      timeOut: 3000,
      extendedTimeOut: 3000
        }
 );
}
checkForUnFollowErrorAlert() {
  this.props.toaster.error(
    'Error while unfollowed',
  '', {
    timeOut: 3000,
    extendedTimeOut: 3000
      }
);
}
  unFollowQuestion(){
    var that = this;
    var qid = this.props.qid;
    var unfollowdown=that.props.followCount;
    $.ajax({
      type:'POST',
      url:'/unFollowQuestion/'+qid,
      data:{user:cookies.get('emailId')},
      success:function(data){
          that.setState({followBtn:true,followups:that.props.followCount});
          that.checkForUnFollowSuccessAlert();
      },
      error:function(err){
          that.checkForUnFollowErrorAlert();
      }
    });
  }


  render(){
    const actions = [
          <FloatingActionButton mini={true} onClick={this.handleClose.bind(this)} style={{align:'center'}}>
            <i className="material-icons">close</i>
          </FloatingActionButton>
        ];
    return(
      <div>
            <Paper  zDepth={5} style={styles.paper}>
              <Table style={{marginTop:'1%',marginBottom:'1%',}}>
                <TableBody displayRowCheckbox={false} style={{paddingTop:'5%'}}>
                  <TableRow style={{width:'100%',marginBottom:'0%'}}>
                  <TableRowColumn colSpan="1" >
                    {this.state.profileImg?<img className="inset" src={"../../images/"+this.state.picture} />:
                    <Avatar
                      color={deepOrange300}
                      backgroundColor={purple500}
                      size={50}
                      style={{
                      textTransform:'capitalize',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      zIndex: '999',
                      marginBottom: '20%'
                    }}
                    >
                      {this.state.firstletter}
                    </Avatar>}
                  </TableRowColumn>
                  <TableRowColumn colSpan="10" style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>
                    <a className="question" onClick={this.fetchAnswer.bind(this)}><p className="question1">{this.props.question+'?'}</p></a>
                    <Dialog
                modal={false}
                open={this.state.openAnswer}
                autoDetectWindowHeight={true}
                autoScrollBodyContent={true}
                repositionOnUpdate={true}
                onRequestClose={this.handleClose.bind(this)}
              >
                <FloatingActionButton mini={true} onClick={this.handleClose.bind(this)} style={{float:'right',marginRight:'0%',marginTop:'0%'}}>
                  <i className="material-icons">close</i>
                </FloatingActionButton>
                <h1><center><b><p className="individualquestion">{this.props.question}?</p></b></center></h1>
                {this.state.noAnswers}
              </Dialog>
              </TableRowColumn>
              <TableRowColumn colSpan="1" style={styles.col5}>
                {this.state.showAnswerBtn?<IconButton tooltip="View Answer" tooltipPosition='bottom-left' style={styles.showBtn} onClick={this.fetchAnswer.bind(this)}> <i className="material-icons lg-68 showAnswerBtn">keyboard_arrow_down</i></IconButton>
                :<IconButton tooltip="Hide Answer" tooltipPosition='bottom-left' style={styles.showBtn} onClick={this.hideAnswer.bind(this)}> <i className="material-icons lg-68 showAnswerBtn">keyboard_arrow_up</i></IconButton>}
              </TableRowColumn>
              </TableRow>
              {this.state.showAnswer?
                <TableRow style={{height:'50%',width:'100%',height:'auto'}}>
                    <TableRowColumn colSpan="12" style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>
                      {this.state.answers}
                    </TableRowColumn>
                </TableRow>:''
              }
            <TableRow style={{height:'50%',float:'left',border:'0%',marginLeft:'180%',borderBottom:'0px'}}>
            <TableRowColumn colSpan="1" style={styles.col2}>
              <IconButton style={{height:'10%'}} tooltip="Post Answer" tooltipPosition='top-center' onClick={this.postAnswer.bind(this)}>
              <i className="material-icons pencil_color" style={{marginTop:'5%',cursor:'pointer'}} >create</i>
            <Dialog
                modal={false}
                open={this.state.openAnswer1}
                autoDetectWindowHeight={true}
                autoScrollBodyContent={true}
                repositionOnUpdate={true}
                onRequestClose={this.handleClose.bind(this)}
              >
                <FloatingActionButton mini={true} onClick={this.handleClose.bind(this)} style={{float:'right',marginRight:'0%',marginTop:'0%'}}>
                  <i className="material-icons">close</i>
                </FloatingActionButton>
            <h3><center><b><p className="individualquestion">{this.props.question}?</p></b></center></h3>
            {this.state.postanswers}
            </Dialog>
              </IconButton>
            </TableRowColumn>

            <TableRowColumn colSpan="1" style={styles.col1} >
              <Badge
                  badgeContent={this.state.followups}
                  primary={true}
                  style={styles.badge}
                >
                <IconButton tooltip="Followers" tooltipPosition='top-center'>
                  <i className="material-icons md-48 follow_count">people</i>
                </IconButton>
                </Badge>
                 </TableRowColumn>
              <TableRowColumn colSpan="1" style={styles.col4}>
             {this.state.button?(this.state.followBtn?<IconButton tooltip="Click to follow" tooltipPosition='top-center' style={styles.followBtn} onClick={this.followQuestion.bind(this)}> <i className="material-icons md-48 follow_button">person_add</i></IconButton>
              :<IconButton tooltip="Unfollow" tooltipPosition='top-center' style={styles.unfollowBtn} onClick={this.unFollowQuestion.bind(this)}> <i className="material-icons md-48 follow_button">person_add</i></IconButton>):''}
              </TableRowColumn>

              <TableRowColumn colSpan="9" style={styles.col3}>
                <p style={{paddingTop:'1%'}}>Asked  <Moment fromNow>{(this.props.timestamp).toString()}</Moment>   by   </p>
                <Chip style={{marginLeft:'30px'}}>
                  <Avatar size={32} color={grey50} backgroundColor={grey900}>
                  {this.state.firstletter}
                  </Avatar>
                  {this.props.postedBy}
                </Chip>
              </TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
    </div>
    )};
}
