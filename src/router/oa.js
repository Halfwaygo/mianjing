
import operationAnalysis from "../containers/operationAnalysis";
import appGeneral from "../containers/appGeneral";
import channelAnalysis from "../containers/channelAnalysis";
import userProfile from "../containers/userProfile";
import timebucketAnalysis from "../containers/timebucketAnalysis";
import geographicalAnalysis from "../containers/geographicalAnalysis";
import startupsAnalysis from "../containers/startupsAnalysis";
import usedurationAnalysis from "../containers/usedurationAnalysis";
import apptypeAnalysis from "../containers/apptypeAnalysis";
import OSAnalysis from "../containers/OSAnalysis";
import resolutionAnalysis from "../containers/resolutionAnalysis";
import operatorAnalysis from "../containers/operatorAnalysis";
import eventManagement from "../containers/eventManagement";
import exceptionData from "../containers/exceptionData";


export default {
    path: '/operationAnalysis/', 
    component: operationAnalysis, 
    children: [
        {path: 'appGeneral',name: 'appGeneral', component: appGeneral,meta:{requireAuth: true }},

        {path: 'channelAnalysis',name: 'channelAnalysis', component: channelAnalysis,meta:{requireAuth: true }},

        {path: 'userProfile',name: 'userProfile', component: userProfile,meta:{requireAuth: true }},
        {path: 'timebucketAnalysis',name: 'timebucketAnalysis', component: timebucketAnalysis,meta:{requireAuth: true }},
        {path: 'geographicalAnalysis',name: 'geographicalAnalysis', component: geographicalAnalysis,meta:{requireAuth: true }},

        {path: 'startupsAnalysis',name: 'startupsAnalysis', component: startupsAnalysis,meta:{requireAuth: true }},
        {path: 'usedurationAnalysis',name: 'usedurationAnalysis', component: usedurationAnalysis,meta:{requireAuth: true }},

        {path: 'apptypeAnalysis',name: 'apptypeAnalysis', component: apptypeAnalysis,meta:{requireAuth: true }},
        {path: 'OSAnalysis',name: 'OSAnalysis', component: OSAnalysis,meta:{requireAuth: true }},
        {path: 'resolutionAnalysis',name: 'resolutionAnalysis', component: resolutionAnalysis,meta:{requireAuth: true }},
        {path: 'operatorAnalysis',name: 'operatorAnalysis', component: operatorAnalysis,meta:{requireAuth: true }},

        {path: 'eventManagement',name: 'eventManagement', component: eventManagement,meta:{requireAuth: true }},

        {path: 'exceptionData',name: 'exceptionData', component: exceptionData,meta:{requireAuth: true }},
    ]
}