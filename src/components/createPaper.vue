<template>
    <div>
        <div class="crumb">hello 我是试卷库里面的'新建试卷' (此处要用面包屑)</div>
        <div  class="createPaper">
            <div class="create-paper-title">新建空白试卷</div>
            
                <el-form ref="form" :model="form" label-width="80px" class="exam-form">
                    <div style="height:40px;display:inline-block;" class="create-paper-name">
                      <el-form-item label="试卷名称：" class="paper-name" style="margin-right:50px;">
                        <el-input v-model="form.name" placeholder="请输入试卷（20字以内）"></el-input>
                      </el-form-item>
                      <el-form-item label="试卷分类：" class="paper-name">
                        <el-input v-model="form.score" placeholder="未归类"></el-input>
                      </el-form-item>
                      </div>
                      <div class="questions">
                        <div class="choose-question">从试题库选题</div>
                        <div class="add-question"> + 添加题目</div>
                      </div>
                      <div class="design-question">
                        <h5>设计题目</h5>
                        <div style="height:40px;width:100%;display:inline-block;margin-bottom:20px;">
                          <el-form-item label="题目：" class="question" >
                            <el-input v-model="form.name" placeholder="请输入题目"></el-input>
                          </el-form-item>
                          <el-form-item label="分值：" class="score">
                            <el-input v-model="form.score" placeholder="5"></el-input>
                          </el-form-item>
                        </div>

                        <!-- <div class="options" style=""> -->
                            <el-form-item label="A" class="option" style="float:left;display:inline-block;width:384px;height:40px;">
                              <el-input v-model="form.option1" placeholder="选项一"></el-input>
                            </el-form-item> 
                            <span class="error" style="">×</span>
                            <el-form-item label="" style="width:120px;height:40px;display:inline-block;">
                                <el-checkbox-group v-model="form.type">
                                  <el-checkbox label="设为答案" name="type"></el-checkbox>
                                </el-checkbox-group>
                              </el-form-item>
                        <!-- </div> -->

                        <!-- <el-form-item label="B" class="option" style="float:left;display:inline-block;width:384px;height:40px;">
                          <el-input v-model="form.option1" placeholder="选项二"></el-input>
                        </el-form-item> 
                        <span class="error" style="">×</span>
                        <el-form-item label="" style="width:120px;height:40px;display:inline-block;">
                            <el-checkbox-group v-model="form.type">
                              <el-checkbox label="设为答案" name="type"></el-checkbox>
                            </el-checkbox-group>
                          </el-form-item> -->
                        

                        <el-form-item label="" class="add-option">
                          <el-input v-model="form.option3" placeholder="+ 添加选项" disabled></el-input>
                        </el-form-item>
                        <div>
                            <label for="">课程分类：</label>
                            <el-select v-model="courseType" placeholder="请选择" class="Knowledge-points">
                                <el-option
                                  v-for="item in COURSE_TYPE"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="courseType2" placeholder="请选择" class="Knowledge-points">
                                <el-option
                                  v-for="item in COURSE_TYPE2"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="courseType2" placeholder="请选择" class="Knowledge-points">
                                <el-option
                                  v-for="item in COURSE_TYPE2"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                            </el-select>
                        </div>

                        <el-form-item label="难易程度:">
                            <el-radio-group v-model="form.resource" class="difficult">
                              <el-radio label="易"></el-radio>
                              <el-radio label="中"></el-radio>
                              <el-radio label="难"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                          
                      </div>
                </el-form>

        
                <!-- 第二部分 -->
                
                <el-form ref="form" :model="form" label-width="80px" class="exam-form" style="margin-top:20px;">
                  <div class="questions">
                    <div class="add-question"> + 添加题目</div>
                  </div>
                  <div class="design-question">
                    <h5>设计题目</h5>
                    <div style="height:40px;">
                      <el-form-item label="题目：" class="question">
                        <el-input v-model="form.name" placeholder="请输入题目"></el-input>
                      </el-form-item>
                      <el-form-item label="分值：" class="score">
                        <el-input v-model="form.score" placeholder="5"></el-input>
                      </el-form-item>
                    </div>
                    <div class="options" style="">
                        <el-form-item label="A" class="option" style="float:left;diaplay:inline-block;">
                          <el-input v-model="form.option1" placeholder="选项一"></el-input>
                        </el-form-item>
                        <span class="error" style="">×</span>
                        <el-form-item label="" style="margin-top:20px;">
                            <el-checkbox-group v-model="form.type">
                              <el-checkbox label="设为答案" name="type"></el-checkbox>
                            </el-checkbox-group>
                          </el-form-item>
                    </div>

                    <div class="options" style="">
                        <el-form-item label="B" class="option" style="float:left;diaplay:inline-block;">
                          <el-input v-model="form.option1" placeholder="选项二"></el-input>
                        </el-form-item>
                        <span class="error" style="">×</span>
                        <el-form-item label="" style="margin-top:20px;">
                            <el-checkbox-group v-model="form.type">
                              <el-checkbox label="设为答案" name="type"></el-checkbox>
                            </el-checkbox-group>
                          </el-form-item>
                    </div>

                    
                    <el-form-item label="" class="add-option">
                      <el-input v-model="form.option3" placeholder="+ 添加选项" disabled></el-input>
                    </el-form-item>
                    <div>
                        <label for="">课程分类：</label>
                        <el-select v-model="courseType" placeholder="请选择" class="Knowledge-points">
                            <el-option
                              v-for="item in COURSE_TYPE"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="courseType2" placeholder="请选择" class="Knowledge-points">
                            <el-option
                              v-for="item in COURSE_TYPE2"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="courseType2" placeholder="请选择" class="Knowledge-points">
                            <el-option
                              v-for="item in COURSE_TYPE2"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                        </el-select>
                    </div>

                    <el-form-item label="难易程度:">
                        <el-radio-group v-model="form.resource" class="difficult">
                          <el-radio label="易"></el-radio>
                          <el-radio label="中"></el-radio>
                          <el-radio label="难"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                          
                    </div>
                </el-form>

                <div class="paper-details">
                    <create-paper-table :source="source"
                        :propertyLabels="propertyLabels"
                        :pageSize="pageSize"
                        :total="total"
                        ></create-paper-table>
                </div>
                
            
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import * as C from '../constants/api';
    import * as CONST from "../constants/const";
    import utils from  '../utils/misc';
    //import pageHeader from '../components/pageHeader';
    import Tab from  '../components/Tab';
    import createPaperTable from  '../components/createPaperTable';

    export default {
        name: 'createPaper',

        

        components: {
            createPaperTable, //pageHeader 
        },

        data(){
            return {
                form: {
                  name: '',
                  region: '',
                  date1: '',
                  date2: '',
                  delivery: false,
                  type: [],
                  resource: '',
                  desc: '',
                  option1:'',
                },
                courseType:1,
                courseType2:1,
                COURSE_TYPE: CONST.COURSE_TYPE,
                COURSE_TYPE2: CONST.COURSE_TYPE2,
                propertyLabels: [
                    {key: 'type', name: '题形', sortable: true},
                    {key: 'name', name: '单选', sortable: true},
                    {key: 'YestIncUser', name: '多选' , sortable: true},
                ],
                
            }
        },

        watch: {
            
        },

        beforeMount() {
            
        },
        created () {
            
        },
        mounted() {
            
            
        },

        computed:{

            

            overviewDataParams() {
                return {
                    suffix: this.AppType + '.json',
                    //caliberId: this.caliberId,
                    //caliberId: 1,
                };
            },
           

            ...mapState({
                AppType: ({root}) => root.AppType,
                caliberId: ({root}) => root.caliberId,
                general: ({dataOverview}) => dataOverview.general,
                source:({dataOverview}) => dataOverview.list,
                
            }),
        },
        
        methods: {
            onSubmit(){

            },
     

            


            ...mapActions(["showPageLoading", "hidePageLoading"]),
            //"getDownTable",
        },
    };
</script>


<style lang='less' scoped='scoped'>






    
</style>