import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { account, appwriteConfig,database} from "../../../../src/appwriteConfig";
import { ID, Query } from "appwrite";


const AuthContext = createContext();  //initializing context

 //create provider of context
export const AuthProvider = ({children}) =>{

  const[loading, setLoading] = useState(true);
  const[user, setUser] = useState(null);
  const navigate = useNavigate();


//when page render firsttime load already login user 
  useEffect(()=>{

    getUserLoad();
  },[])



  //method to remain user loaded always, so he doesnot have to login everytime
const getUserLoad=async()=>{
  //will get account details of loged in user
  try{const  accountDetails = await account.get();
    //access different collection of same documentid as userid, and access all attributes in it
    const profiles = await database.getDocument(appwriteConfig.databaseid,appwriteConfig.profileCollecionid, accountDetails.$id);
     //add profile data in user account detals array
     accountDetails['profile'] = profiles
  setUser(accountDetails)
  console.log('user',user)
  }catch(error){
    console.log(error)
  }
      
  setLoading(false)
}

const signupUser= async(newUserInfo)=>{
  try{
    const newUser =await account.create(ID.unique(),
      newUserInfo.email,
      newUserInfo.password,
      newUserInfo.username)

    //will get account details of loged in user
    console.log('id',newUser.$id)
    const payload={
      'followers':[],
      'following':[],
      'follower_count':0,
      'following_count':0,
      'profile_pic': null,
      'username':newUser.name,
      'userid':newUser.$id,
      'liked_treads':[],
      'bio':'',
      'link':null
    }
  
    const response =await database.createDocument(
      appwriteConfig.databaseid,
      appwriteConfig.profileCollecionid,
      newUser.$id,
      payload);
      
  console.log('newUserdoc:',response)
    console.log(newUser)
    console.log('userid',newUser.$id)
    if(newUser){
     return  loginUser(newUserInfo);
    }else{
      return newUser
    }
  }catch(error){
    console.log(error);
  }
}

//login authentic user int appwrite with credential pass from login form
  const loginUser=async(userInfo)=>{
    //login with credentials to app write
    try{
      const response = await account.createEmailSession(
        userInfo.email, userInfo.password
      )
      //will get account details of loged in user
      const  accountDetails = await account.get();
      setUser(accountDetails)
      navigate('/'); //after login user will be redirected to home page

    }catch(error){
      console.log(error);
    }
  }
 
  //logout user from appwrite
  const logOutUser=()=>{
    account.deleteSession('current')
    setUser(null); //set user to null on logout
    //navigate user to login page
    navigate('/login')
  }

//user data with login method pass to context provider, so any component can access this
  const contextData = {
    user,
     loginUser,
     logOutUser,
     signupUser

  }
  return (
  <AuthContext.Provider  value={contextData} >
    
    {loading? (<p>Loading...</p>): (children)}

    </AuthContext.Provider>
)}
export const useAuth = ()=> {return useContext(AuthContext)}  //consuming context  

export default AuthContext