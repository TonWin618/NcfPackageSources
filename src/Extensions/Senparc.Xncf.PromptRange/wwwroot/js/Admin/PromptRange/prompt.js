var app = new Vue({
    el: "#app",
    data() {
        return {
            devHost: 'http://pr-felixj.frp.senparc.com',
            pageChange: false, // 页面是否有变化
            isAvg: true, // 是否平均分 默认false 不平均
            // 配置 输入 ---start
            promptField: '', // 靶场列表
            promptFieldOpt: [], // 靶场列表
            promptOpt: [], // prompt列表
            modelOpt: [], // 模型列表
            promptid: '',// 选择靶场
            modelid: '',// 选择模型
            content: '',// prompt 输入内容
            remarks: '', // prompt 输入的备注
            numsOfResults: 1, // prompt 的连发次数(发射次数) 1-10
            numsOfResultsOpt: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // prompt 的连发次数(发射次数) 1-10
            // 参数设置 视图配置列表
            parameterViewList: [
                {
                    tips: '控制词的选择范围，值越高，生成的文本将包含更多的不常见词汇',
                    formField: 'topP',
                    label: 'Top_p',
                    value: 0.5,
                    isSlider: true,
                    isStr: false,
                    sliderMin: 0,
                    sliderMax: 1,
                    sliderStep: 0.1
                },
                {
                    tips: '采样温度，较高的值如0.8会使输出更加随机，而较低的值如0.2则会使其输出更具有确定性',
                    formField: 'temperature',
                    label: 'Temperature',
                    value: 0.5,
                    isSlider: true,
                    isStr: false,
                    sliderMin: 0,
                    sliderMax: 1,
                    sliderStep: 0.1
                },
                {
                    tips: '生成文本的最大长度',
                    formField: 'maxToken',
                    label: 'MaxToken',
                    value: 100,
                    isSlider: false,
                    isStr: false,
                    sliderMin: 0,
                    sliderMax: 'Infinity',
                    sliderStep: 1
                },
                {
                    tips: '惩罚频繁出现的词',
                    formField: 'frequencyPenalty',
                    label: 'Frequeny_penalty',
                    value: 0,
                    isSlider: true,
                    isStr: false,
                    sliderMin: -2,
                    sliderMax: 2,
                    sliderStep: 0.1
                },
                {
                    tips: '惩罚已出现的词',
                    formField: 'presencePenalty',
                    label: 'Presence_penalty',
                    value: 0,
                    isSlider: true,
                    isStr: false,
                    sliderMin: -2,
                    sliderMax: 2,
                    sliderStep: 0.1
                },
                {
                    tips: '设定生成文本时的终止词序列。当遇到这些词序列时，模型将停止生成',
                    formField: 'stopSequences',
                    label: 'StopSequences',
                    value: '',
                    isSlider: false,
                    isStr: true,
                    sliderMin: 0,
                    sliderMax: 'Infinity',
                    sliderStep: 1
                }
            ],
            promptLeftShow: false, // prompt左侧区域整体 显隐
            parameterViewShow: false, // 模型参数设置 显隐 false是默认显示 trun是隐藏
            targetShootLoading: false, // 打靶loading
            // 配置 输入 ---end
            // prompt请求参数 ---start
            promptParamVisible: true,// prompt请求参数 显隐 false是显示 trun是默认隐藏
            promptParamFormLoading: false,
            promptParamForm: {
                prefix: '',
                suffix: '',
                variableList: []
            },
            // prompt请求参数 ---end
            // sendBtns: 打靶、连发、保存草稿
            sendBtns:[
                {
                    text:'打靶'
                },
                {
                    text:'连发'
                },
                {
                    text:'保存草稿'
                }
            ],
            sendBtnText:'打靶',
            // 输出 ---start
            outputAverage: '',// 输出列表的平均分
            outputActive: '', // 输出列表选中查看|评分
            outputList: [],  // 输出列表
            chartData: [], // 图表数据
            chartInstance: null, // 图表实例
            // 输出 ---end
            // 版本记录 ---start
            versionDrawer: false,// 抽屉
            versionSearchVal: '', // 版本搜索
            versionTreeProps: {
                children: 'children',
                label: 'label'
            },
            versionTreeData: [],
            // 版本记录 ---end
            // 战术选择
            tacticalFormVisible: false,
            tacticalFormSubmitLoading: false,
            tacticalForm: {
                tactics: '重新瞄准'
            },
            // 靶场
            fieldFormVisible: false,
            fieldFormSubmitLoading: false,
            fieldForm: {
                fieldName:''
            },
            // ai 评分标准
            aiScoreFormVisible: false,
            aiScoreFormSubmitLoading: false,
            aiScoreForm: {
                resultList:[{
                    id: 1,
                    label: '预期结果1',
                    value: ''
                }]
            },

            // 模型
            modelFormVisible: false,
            modelFormSubmitLoading: false,
            modelForm: {
                modelType: "", // string
                name: "", // string
                apiVersion: "", // string
                apiKey: "", // string
                endpoint: "", // string
                organizationId: "", // string
            },
            modelTypeOpt: [{
                value: 'OpenAI',
                label: 'OpenAI',
                disabled: false
            }, {
                value: 'AzureOpenAI',
                label: 'AzureOpenAI',
                disabled: false
            }, {
                value: 'NeuCharOpenAI',
                label: 'NeuCharOpenAI',
                disabled: false
            }, {
                value: 'HugginFace',
                label: 'HugginFace',
                disabled: false
                }],
            // 表单校验规则
            rules: {
                fieldName: [
                    { required: true, message: '请输入靶场名称', trigger: 'blur' }
                ],
                tactics: [
                    {required: true, message: '请选择战术', trigger: 'change'}
                ],
                prefix: [
                    {required: true, message: '请输入前缀', trigger: 'blur'}
                ],
                suffix: [
                    {required: true, message: '请输入后缀', trigger: 'blur'}
                ],
                variableValue: [
                    {required: true, message: '请输入变量值', trigger: 'blur'}
                ],
                modelType: [
                    {required: true, message: '请选择模型类型', trigger: 'change'}
                ],
                name: [
                    {required: true, message: '请输入模型名称', trigger: 'blur'}
                ],
                apiVersion: [
                    {required: true, message: '请输入API Version', trigger: 'blur'}
                ],
                apiKey: [
                    {required: true, message: '请输入API key', trigger: 'blur'}
                ],
                variableName: [
                    {required: true, message: '请输入变量名', trigger: 'blur'}
                ],
                endpoint: [
                    {required: true, message: '请输入End Point', trigger: 'blur'}
                ],
                organizationId: [
                    {required: true, message: '请输入Organization Id', trigger: 'blur'}
                ],
                aiResultVal:[
                    { required: true, message: '请输入期望结果', trigger: 'blur' }
                ]
            },
            versionData: [],
            promptDetail: {}
        };
    },
    watch: {
        //'isExtend': {
        //    handler: function (val, oldVal) {
        //    },
        //    immediate: true,
        //    //deep:true
        //}
        versionSearchVal(val) {
            this.$refs.versionTree.filter(val);
        }
    },
    created() {
        // 浏览器关闭|浏览器刷新|页面关闭|打开新页面 提示有数据变动保存数据
        // 添加 beforeunload 事件监听器
        window.addEventListener('beforeunload', this.beforeunloadHandler);
    },
    mounted() {
        // 获取靶道列表
        this.getFieldList()
        // 获取模型列表
        this.getModelOptData()
        // 获取分数趋势图
        // this.getScoringTrendData()
        // 图表自适应
        const self = this;
        const viewElem = document.body;
        const resizeObserver = new ResizeObserver(() => {
            // 加个if约束，当Echarts存在时再执行resize()，否则图表不存在时运行到这会报错。
            if (self.chartInstance) {
                self.chartInstance.resize();
            }
        });
        resizeObserver.observe(viewElem);

    },
    beforeDestroy() {
        // 销毁之前移除事件监听器
        window.removeEventListener('beforeunload', this.beforeunloadHandler);
    },
    methods: {
        // 连发次数 数量变化
        changeNumsBtn(command=1) {
            this.numsOfResults = command
        },
        // 打靶按钮 类型切换
        changeBtn(command){
            this.sendBtnText = command
        },
        // 打靶按钮 点击 触发对应类型事件
        clickSendBtn(){
          const command=this.sendBtnText
            console.log('点击了'+command)
            if(command==='打靶'){
                this.targetShootHandel()
            }else if(command==='保存草稿') {
                this.targetShootHandel(true)
            }else if (command==='连发'){
                this.dealRapicFireHandel(this.numsOfResults)
            }
        },
        // beforeunload 事件处理函数
        beforeunloadHandler(e) {
            console.log('浏览器关闭|浏览器刷新|页面关闭|打开新页面')
             // 如果数据没有变动，则不需要提示用户保存
            if (this.pageChange) {
                // 显示自定义对话框
                let confirmationMessage = '您的数据已经修改，是否保存？';
                // 阻止默认行为
                e.preventDefault();
                // 兼容旧版本浏览器
                e.returnValue = confirmationMessage;
                return confirmationMessage;
            }
            //setTimeout(function () {
            //    // 弹出自定义模态框
            //    var modal = document.createElement("div");
            //    modal.innerHTML = "您确定要离开本页面吗？";
            //    var btn = document.createElement("button");
            //    btn.textContent = "留在页面";
            //    btn.onclick = function () {
            //        // 取消默认的 beforeunload 行为
            //        e.preventDefault();
            //        // 关闭自定义模态框
            //        modal.remove();
            //    };
            //    modal.appendChild(btn);
            //    document.body.appendChild(modal);
            //}, 0);
        },
        // 格式化时间
        formatDate(d) {
            var date = new Date(d);
            var YY = date.getFullYear() + '-';
            var MM =
                (date.getMonth() + 1 < 10
                    ? '0' + (date.getMonth() + 1)
                    : date.getMonth() + 1) + '-';
            var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            var hh =
                (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            var mm =
                (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
                ':';
            var ss =
                date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return YY + MM + DD + ' ' + hh + mm + ss;
        },
        // 输出 分数趋势图初始化
        chartInitialization() {
            let scoreChart = document.getElementById('promptPage_scoreChart');
            let chartOption = {
                tooltip: {
                    show: true,
                    //formatter: function (params) {
                    //    console.log('params', params)
                    //    return '测试显示tooltip'
                    //}
                },
                xAxis3D: {
                    type: "category",
                    name: "",
                    axisLabel: {
                        show: true,
                        interval: 0  //使x轴都显示
                    },
                    data: this.chartData?.xData || [],
                },
                yAxis3D: {
                    type: "category",
                    name: "",
                    axisLabel: {
                        show: true,
                        interval: 0  //使x轴都显示
                    },
                    data: this.chartData?.yData || [],

                },
                zAxis3D: {
                    type: "value",
                    name: "",
                    //max: 10,
                },
                //  grid3D
                grid3D: {
                    show: true,
                    boxHeight: 150, // 3维图表的高度 z轴
                    boxWidth: 400, // 3维图表的宽度 x轴
                    boxDepth: 150, // 3维图表的深度 y轴
                    // 整个chart背景，可为自定义颜色或图片
                    environment: '#fff',
                    //坐标轴轴线(线)控制
                    axisLine: {
                        show: true,//该参数需设为true
                        // interval:200,//x,y坐标轴刻度标签的显示间隔，在类目轴中有效。
                        lineStyle: {//坐标轴样式
                            color: 'red',
                            opacity: 1,//(单个刻度不会受影响)
                            width: 2//线条宽度
                        }
                    },
                    // 坐标轴 label
                    axisLabel: {
                        show: true,//是否显示刻度  (刻度上的数字，或者类目)
                        interval: 5,//坐标轴刻度标签的显示间隔，在类目轴中有效。
                        //formatter: function (v) {
                        //    // return;
                        //},
                        textStyle: {
                             color:'#000',//刻度标签样式
                            //color: function (value, index) {
                            //    return value >= 6 ? 'green' : 'red';//根据范围显示颜色，主页为值有效
                            //},
                            //  borderWidth:"",//文字的描边宽度。
                            //  borderColor:'',//文字的描边颜色。
                            fontSize: 12,//刻度标签字体大小
                            fontWeight: '400',//粗细
                        }
                    },
                    //刻度
                    axisTick: {
                        show: false,//是否显示出
                        // interval:100,//坐标轴刻度标签的显示间隔，在类目轴中有效
                        length: 5,//坐标轴刻度的长度
                        lineStyle: {//举个例子，样式太丑将就
                            color: '#000',//颜色
                            opacity: 1,
                            width: 5//厚度（虽然为宽表现为高度），对应length*(宽)
                        }
                    },
                    //平面上的分隔线。
                    splitLine: {
                        show: true,//立体网格线  
                        // interval:100,//坐标轴刻度标签的显示间隔，在类目轴中有效
                        splitArea: {
                            show: true,
                            // interval:100,//坐标轴刻度标签的显示间隔，在类目轴中有效
                            areaStyle: {
                                color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)', 'rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
                            }
                        },
                    },
                    // 坐标轴指示线。
                    axisPointer: {
                        show: false,//鼠标在chart上的显示线
                        // lineStyle:{
                        //     color:'#000',//颜色
                        //     opacity:1,
                        //     width:5//厚度（虽然为宽表现为高度），对应length*(宽)
                        // }
                    },
                    //viewControl用于鼠标的旋转，缩放等视角控制。(以下适合用于地球自转等)
                    viewControl: {
                        // projection: 'orthographic'//默认为透视投影'perspective'，也支持设置为正交投影'orthographic'。
                // autoRotate:true,//会有自动旋转查看动画出现,可查看每个维度信息
                // autoRotateDirection:'ccw',//物体自传的方向。默认是 'cw' 也就是从上往下看是顺时针方向，也可以取 'ccw'，既从上往下看为逆时针方向。
                // autoRotateSpeed:12,//物体自传的速度
                // autoRotateAfterStill:2,//在鼠标静止操作后恢复自动旋转的时间间隔。在开启 autoRotate 后有效。
                 distance:300,//默认视角距离主体的距离(常用)
                 alpha:1,//视角绕 x 轴，即上下旋转的角度(与beta一起控制视野成像效果)
                 beta:30,//视角绕 y 轴，即左右旋转的角度。
                // center:[]//视角中心点，旋转也会围绕这个中心点旋转，默认为[0,0,0]
                        animation: true,
                    },
                    //光照相关的设置
                    //light: {
                    //    main: {
                    //        color: '#fff',//光照颜色会与所设置颜色发生混合
                    //        intensity: 1.2,//主光源的强度(光的强度)
                    //        shadow: false,//主光源是否投射阴影。默认关闭。
                    //        // alpha:0//主光源绕 x 轴，即上下旋转的角度。配合 beta 控制光源的方向(跟beta结合可确定太阳位置)
                    //        // beta:10//主光源绕 y 轴，即左右旋转的角度。
                    //    },
                    //    ambient: {//全局的环境光设置。
                    //        intensity: 0.3,
                    //        color: '#fff'//影响柱条颜色
                    //    },
                    //    // ambientCubemap: {//会使用纹理作为光源的环境光
                    //    //  texture: 'pisa.hdr',
                    //    // // 解析 hdr 时使用的曝光值
                    //    // exposure: 1.0
                    //    // }
                    //},
            // postEffect:{//后处理特效的相关配置，后处理特效可以为画面添加高光，景深，环境光遮蔽（SSAO），调色等效果。可以让整个画面更富有质感。
            //     show:true,
            //     bloom:{
            //         enable:true//高光特效,适合地球仪
            //     }
            // }
                },
                series: []
            };
            let _series = []
            this.chartData?.seriesData?.forEach(item => {
                if (item) {
                    series.push({
                        type: 'line3D', // line3D scatter3D
                        name: item[0][1],
                        //itemStyle: {
                        //    color: 'rgb(165,  0, 38)'
                        //},
                        //label: {  //当type为scatter3D时有label出现
                        //    show: false,
                        //    position: 'bottom',
                        //    distance: 0,
                        //    textStyle: {
                        //        color: '#ffffff',
                        //        fontSize: 12,
                        //        borderWidth: 0,
                        //        borderColor: '#c6c6c6',
                        //        backgroundColor: 'transparent'
                        //    }
                        //},
                        data: item    //每个区的数据一一对应
                    })
                }
            })
            chartOption.series = _series
            console.log('chartOption', chartOption)
            let chartInstance = echarts.init(scoreChart);
            chartInstance.setOption(chartOption);
            this.chartInstance = chartInstance
        },
        // 输出 获取评分趋势 图表数据
        async getScoringTrendData() {
            this.chartData = {
                xData: [],
                yData: [],
                seriesData: []
            }
            if (this.promptid) {
                //console.log('获取评分趋势 图表数据', this.isAvg)
               /* /api/Senparc.Xncf.PromptRange/StatisticAppService/Xncf.PromptRange_StatisticAppService.GetLineChartDataAsync?promptItemId=${this.promptid}*/
                let res = await service.get(`/api/Senparc.Xncf.PromptRange/StatisticAppService/Xncf.PromptRange_StatisticAppService.GetLineChartDataAsync?promptItemId=${this.promptid}&isAvg=${this.isAvg}`)
                if (res.data.success) {
                    let _dataPoints = res?.data?.dataPoints || []
                    let _xData = [], _yData = [], _seriesData =[]
                    _dataPoints.forEach(item => {
                        if (item && item.length > 0) {
                            let _zData = []
                            item.forEach(el => {
                                if (el) {
                                    if (_xData.indexOf(el.y)===-1) {
                                    _xData.push(el.y)
                                    }
                                    if (_yData.indexOf(el.x) === -1) {
                                    _yData.push(el.x)
                                    }
                                    _zData.push([el.y, el.x, el.z])
                                }
                            })
                            _seriesData.push(_zData)
                        }
                    })
                    this.chartData = {
                        xData: _xData,
                        yData: _yData,
                        seriesData: _seriesData
                    }
                }
            }

            // 初始化图表 接口调用成功
            this.chartInitialization()
            //let _setOption = {
            //    xAxis: {
            //        data: this.chartData.xData || []
            //    },
            //    series: [{
            //        data: this.chartData.vData || []
            //    }]
            //}
            //this.chartInstance.setOption(_setOption);
        },

        // 靶道选择变化
        promptChangeHandel(val, itemKey) {
            console.log('靶道选择变化', val, this.promptDetail)
            if (itemKey === 'promptid') {
                this.getPromptetail(val, true)
            } else {
                this.pageChange = true
            }

        },

        // 战术选择 关闭弹出
        // 战术选择 dialog 关闭
        tacticalFormCloseDialog() {
            this.tacticalForm = {
                tactics: ''
            }
            this.$refs.tacticalForm.resetFields();
        },
        // 战术选择 dialog 提交
        tacticalFormSubmitBtn() {
            this.$refs.tacticalForm.validate(async (valid) => {
                if (valid) {
                    this.tacticalFormSubmitLoading = true
                    let _postData = {
                        //promptid: this.promptid,// 选择靶场
                        modelid: this.modelid,// 选择模型
                        content: this.content,// prompt 输入内容
                        note: this.remarks, // prompt 输入的备注
                        numsOfResults:1,
                        isDraft: this.sendBtnText==='保存草稿'
                    }
                    if (this.promptid) {
                        _postData.id = this.promptid
                        if (this.tacticalForm.tactics === '创建新战术') {
                            _postData.isNewTactic = true // prompt 新建分支
                        }
                        if (this.tacticalForm.tactics === '新增子战术') {
                            _postData.isNewSubTactic = true // prompt 新建子分支
                        }
                        if (this.tacticalForm.tactics === '重新瞄准') {
                            _postData.isNewAiming = true // prompt 内容变化
                        }
                    }
                    // id: null, // 
                    this.parameterViewList.forEach(item => {
                        // todo 单独处理
                        if (item.formField === 'stopSequences') {
                            _postData[item.formField] = item.value ? JSON.stringify(item.value.split(',')) : ''
                        } else if (item.formField === 'maxToken') {
                            _postData[item.formField] = item.value ? Number(item.value) : 0
                        } else {
                            _postData[item.formField] = item.value
                        }
                    })

                    let res = await service.post('/api/Senparc.Xncf.PromptRange/PromptItemAppService/Xncf.PromptRange_PromptItemAppService.Add', _postData)
                    // console.log('testHandel res ', res.data)
                    this.tacticalFormSubmitLoading = false
                    if (res.data.success) {
                        // 关闭dialog
                        this.tacticalFormVisible = false
                        let {promptResultList = [], fullVersion = '', id} = res.data.data || {}
                        // 重新获取prompt列表
                        this.getPromptOptData(id)

                        // 拷贝数据
                        let copyResultData = JSON.parse(JSON.stringify(res.data.data))
                        delete copyResultData.promptResultList
                        this.promptDetail = copyResultData
                        // 平均分 
                        this.outputAverage = 0 // 保留整数
                        // 输出列表
                        this.outputList = promptResultList.map(item => {
                            if (item) {
                                item.promptId = id
                                item.version = fullVersion
                                item.scoreType = '1' // 1 ai、2手动 
                                item.isScoreView = false // 是否显示评分视图
                                item.addTime = item.addTime ? this.formatDate(item.addTime) : ''
                                item.scoreVal = 0 // 手动评分
                                // ai评分预期结果
                                item.alResultList = [{
                                    id: 1,
                                    label: '预期结果1',
                                    value: ''
                                }, {
                                    id: 2,
                                    label: '预期结果2',
                                    value: ''
                                }, {
                                    id: 3,
                                    label: '预期结果3',
                                    value: ''
                                }]
                            }
                            return item
                        })
                        console.log('选择正确的靶场')
                        //提交数据后，选择正确的靶场和靶道
                        await this.getFieldList().then(() => {
                            console.log(res.data)
                            this.promptField = res.data.data.fullVersion.split('-')[0]
                            this.getPromptOptData(res.data.data.fullVersion.split('-')[0])
                            this.promptid=res.data.data.id
                            this.$message.success('提交成功')
                        })
                        // 获取分数趋势图表数据
                        this.getScoringTrendData()
                        if (this.numsOfResults>1){
                            //进入连发模式, 根据numOfResults-1 的数量调用N次连发接口
                            this.dealRapicFireHandel(this.numsOfResults-1)
                        }
                    }

                } else {
                    return false;
                }
            });
        },

        // 版本记录 获取版本记录 树形数据
        async getVersionRecordData() {
            let res = await service.get(`/api/Senparc.Xncf.PromptRange/PromptItemAppService/Xncf.PromptRange_PromptItemAppService.GetTacticTree?rangeName=${this.promptField}`)
            if (res.data.success) {
                //console.log('获取版本记录数据', res.data.data.rootNodeList)
                let _listData = res?.data?.data?.rootNodeList || []
                this.versionTreeData = this.treeArrayFormat(_listData)
            }
        },
        //树形数据格式化  参数data:要格式化的数据,child为要格式化数据的子数组值名
        treeArrayFormat(data, child) { 
            let trees = new Array();
            let fn = null;
            let newData = null;
            for(let i in data) {
                    newData = {
                        id: data[i].data.id,
                        label: data[i].name ? data[i].name : "未命名",
                        isPublic: false,
                        data: data[i].data,
                        attributes: data[i].attributes,
                        children: []
                    }
                trees.push(newData);
                fn = this.treeArrayFormat(data[i][child], child);
                if (data[i][child]) {
                    trees[i].childs = fn;
                }
            }
            return trees
         },
        // 版本记录 查看
        seeVersionRecord() {
            this.versionDrawer = true
            // 重新获取数据
            this.getVersionRecordData()
        },
        // 版本记录 树形控件 过滤节点
        versionTreeFilterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) > -1;
        },
        // 版本记录 抽屉关闭
        versionDrawerClose() {
            this.versionSearchVal = ''
        },
        // 版本记录 是否公开
        versionRecordIsPublic(itemData) {
            // console.log('版本记录 是否公开:', itemData)
            // to do 接口对接 async await
        },
        // 版本记录 编辑
        versionRecordEdit(itemData) {
            //console.log('版本记录 编辑:', itemData)
            // to do 接口对接 async await
            // 获取输出列表和平均分
            //this.getOutputList()
            // 获取分数趋势图表数据
            //this.getScoringTrendData()
        },
        // 版本记录 生成代码
        versionRecordGenerateCode(itemData) {
            //console.log('版本记录 生成代码:', itemData)
            // to do 接口对接 async await
        },
        // 版本记录 查看备注
        versionRecordViewNotes(itemData) {
            //console.log('版本记录 查看备注:', itemData)
            // to do 接口对接 async await
        },
        // 版本记录 删除
        versionRecordDelete(itemData) {
            //console.log('版本记录 删除:', itemData)
            // to do 接口对接 async await
        },




        // 获取输出列表
        async getOutputList(promptId) {
            let res = await service.get(`/api/Senparc.Xncf.PromptRange/PromptResultAppService/Xncf.PromptRange_PromptResultAppService.GetByItemId?promptItemId=${promptId}`)
            //console.log('getOutputList:', res)
            if (res.data.success) {
                let {promptResults = [],promptItem={}} = res.data.data || {}
                // 平均分 _totalScore/promptResults 保留整数
                this.outputAverage = promptItem.evaluationScore; // 保留整数
                // 输出列表
                this.outputList = promptResults.map(item => {
                    if (item) {
                        item.promptId = this.promptDetail.id
                        item.version = this.promptDetail.fullVersion
                        item.scoreType = '1' // 1 ai、2手动
                        item.isScoreView = false // 是否显示评分视图
                        item.addTime = item.addTime ? this.formatDate(item.addTime) : ''
                        // 手动评分
                        item.scoreVal = item.humanScore > -1 ? item.humanScore : 0 
                        // ai评分预期结果
                        if (promptItem.expectedResultsJson) {
                            let _expectedResultsJson = JSON.parse(promptItem.expectedResultsJson)
                            item.alResultList = _expectedResultsJson.map((item, index) => {
                                return {
                                    id: index + 1,
                                    label: `预期结果${index + 1}`,
                                    value: item
                                }
                            })
                        } else {
                            item.alResultList = [{
                            id: 1,
                            label: '预期结果1',
                            value: ''
                        }, {
                            id: 2,
                            label: '预期结果2',
                            value: ''
                        }, {
                            id: 3,
                            label: '预期结果3',
                            value: ''
                        }]
                        }
                        
                    }
                    return item
                })
                

            } else {
                alert('error');
            }
        },
        // 输出 保存评分
        async saveManualScore(item, index) {
            //console.log('manualScorVal', this.promptSelectVal, this.manualScorVal)
            if (item.scoreType === '1') {
                let _list = item.alResultList.map(item => item.value)
                let res = await service.post(`/api/Senparc.Xncf.PromptRange/PromptResultAppService/Xncf.PromptRange_PromptResultAppService.RobotScore?isRefresh=true&promptResultId=${item.id}`, _list)
                if (res.data.success) {
                    //console.log('testHandel res data:', res.data.data)
                    // 重新获取输出列表
                    this.getOutputList(item.promptId)
                    // 重新获取图表
                    this.getScoringTrendData()
                } else {
                    this.$message.error(res.data.errorMessage);
                }
            }
            if (item.scoreType === '2') {
                let res = await service.post('/api/Senparc.Xncf.PromptRange/PromptResultAppService/Xncf.PromptRange_PromptResultAppService.HumanScore', {
                    promptResultId: item.id,
                    humanScore: item.scoreVal
                })
                if (res.data.success) {
                    //console.log('testHandel res data:', res.data.data)
                    // 重新获取输出列表
                    this.getOutputList(item.promptId)
                    // 重新获取图表
                    this.getScoringTrendData()
                } else {
                    alert('error!');
                }
            }

            //console.log('saveManualScore res ', res.data)

        },
        // 输出 选中切换
        outputSelectSwitch(index) {
            if (this.outputActive !== '' && this.outputActive !== index) {
                this.outputList[this.outputActive].isScoreView = false
            }
            this.outputActive = index
        },
        // 输出 显示评分视图
        showRatingView(index, scoreType) {
            //event.stopPropagation()
            this.outputList[index].scoreType = scoreType
            this.outputList[index].isScoreView = true
        },
        // 输出 切换ai评分
        alBtnScoring(index) {
            this.outputList[index].scoreType = '1'
        },
        // 输出 ai评分 增加结果行
        addAlScoring(index) {
            let _len = this.outputList[index].alResultList.length
            this.outputList[index].alResultList.push({
                id: _len + 1,
                label: `预期结果${_len + 1}`,
                value: ''
            })
        },
        // 输出 切换手动评分
        manualBtnScoring(index) {
            this.outputList[index].scoreType = '2'
        },


        /*
        * 打靶 事件
        * isDraft 是否保存草稿
        */      
        async targetShootHandel(isDraft=false) {
            if(!this.modelid) {
                this.$message({
                    message: '请选择模型！',
                    type: 'warning'
                })
                return
            }
            if(!this.content) {
                this.$message({
                    message: '请输入内容！',
                    type: 'warning'
                })
                return
            }
            if (this.promptid||isDraft) {
                this.tacticalFormVisible = true
                return
            }

            this.targetShootLoading = true
            let _postData = {
                //promptid: this.promptid,// 选择靶场
                modelid: this.modelid,// 选择模型
                content: this.content,// prompt 输入内容
                note: this.remarks, // prompt 输入的备注,
                numsOfResults: 1,
                //numsOfResults: isDraft?this.numsOfResults:1,
                isDraft:isDraft
            }
            if (this.promptid) {
                _postData.id = this.promptid
                if (this.tacticalForm.tactics === '创建新战术') {
                    _postData.isNewTactic = true // prompt 新建分支
                }
                if (this.tacticalForm.tactics === '新增子战术') {
                    _postData.isNewSubTactic = true // prompt 新建子分支
                }
                if (this.tacticalForm.tactics === '重新瞄准') {
                    _postData.isNewAiming = true // prompt 内容变化
                }
            }
// id: null, // 
            this.parameterViewList.forEach(item => {
                // todo 单独处理
                if (item.formField === 'stopSequences') {
                    _postData[item.formField] = item.value ? JSON.stringify(item.value.split(',')) : ''
                } else if (item.formField === 'maxToken') {
                    _postData[item.formField] = item.value ? Number(item.value) : 0
                } else {
                    _postData[item.formField] = item.value
                }
            })
            console.log('testHandel _postData:', _postData)

            let res = await service.post('/api/Senparc.Xncf.PromptRange/PromptItemAppService/Xncf.PromptRange_PromptItemAppService.Add', _postData)
            // console.log('testHandel res ', res.data)
            this.targetShootLoading = false
            if (res.data.success) {
                let {promptResultList = [], fullVersion = '', id} = res.data.data || {}
                // 重新获取prompt列表
                this.getPromptOptData(id)
                // 拷贝数据
                let copyResultData = JSON.parse(JSON.stringify(res.data.data))
                delete copyResultData.promptResultList
                this.promptDetail = copyResultData
                // 平均分 _totalScore/promptResultList 保留整数
                this.outputAverage = 0 // 保留整数
                // 输出列表
                this.outputList = promptResultList.map(item => {
                    if (item) {
                        item.promptId = id
                        item.version = fullVersion
                        item.scoreType = '1' // 1 ai、2手动 
                        item.isScoreView = false // 是否显示评分视图
                        //时间 格式化  addTime
                        item.addTime = item.addTime ? this.formatDate(item.addTime) : ''
                        // 手动评分
                        item.scoreVal = 0
                        // ai评分预期结果
                        item.alResultList = [{
                            id: 1,
                            label: '预期结果1',
                            value: ''
                        }, {
                            id: 2,
                            label: '预期结果2',
                            value: ''
                        }, {
                            id: 3,
                            label: '预期结果3',
                            value: ''
                        }]
                    }
                    return item
                })
                
                // 获取分数趋势图表数据
                this.getScoringTrendData()
            }
        },
        
        /*
         * 连发 事件
         */
        async dealRapicFireHandel(howmany) {
            if (!this.promptid) {
                this.$message({
                    message: '请选择一个靶道！',
                    type: 'warning'
                })
                return
            }
            this.targetShootLoading=true
            let promises = [];
            for (let i = 0; i < howmany; i++) {
                promises.push(this.rapidFireHandel());
            }
            await Promise.all(promises);
            this.targetShootLoading=false
        },
        async rapidFireHandel() {
            const promptItemId = this.promptid
            const numsOfResults= 1
            return await service.get('/api/Senparc.Xncf.PromptRange/PromptResultAppService/Xncf.PromptRange_PromptResultAppService.GenerateWithItemId',
                {params: {promptItemId, numsOfResults}}).then(res => {
                console.log('testHandel res ', res.data)
                //输出列表
                 res.data.data.promptResults.map(item=>{
                    item.promptId = promptItemId
                    item.scoreType = '1' // 1 ai、2手动 
                    item.isScoreView = false // 是否显示评分视图
                    //时间 格式化  addTime
                    item.addTime = item.addTime ? this.formatDate(item.addTime) : ''
                    // 手动评分
                    item.scoreVal = 0
                    // ai评分预期结果
                    item.alResultList = [{
                        id: 1,
                        label: '预期结果1',
                        value: ''
                    }, {
                        id: 2,
                        label: '预期结果2',
                        value: ''
                    }, {
                        id: 3,
                        label: '预期结果3',
                        value: ''
                    }]
                     this.outputList.push(item)
                })
            })
        },
        
        // 配置 重置参数
        resetConfigurineParam() {
            //console.log('配置参数 重置:', this.parameterViewList)
            // 参数设置 视图配置列表
            this.parameterViewList = [
                {
                    tips: '',
                    formField: 'topP',
                    label: 'Top_p',
                    value: 0.5,
                    isSlider: true,
                    isStr: false,
                    sliderMin: 0,
                    sliderMax: 1,
                    sliderStep: 0.1
                },
                {
                    tips: '',
                    formField: 'temperature',
                    label: 'Temperature',
                    value: 0.5,
                    isSlider: true,
                    isStr: false,
                    sliderMin: 0,
                    sliderMax: 1,
                    sliderStep: 0.1
                },
                {
                    tips: '',
                    formField: 'maxToken',
                    label: 'MaxToken',
                    value: 100,
                    isSlider: false,
                    isStr: false,
                    sliderMin: 0,
                    sliderMax: 'Infinity',
                    sliderStep: 1
                },
                {
                    tips: '',
                    formField: 'frequencyPenalty',
                    label: 'Frequeny_penalty',
                    value: 0,
                    isSlider: true,
                    isStr: false,
                    sliderMin: -2,
                    sliderMax: 2,
                    sliderStep: 0.1
                },
                {
                    tips: '',
                    formField: 'presencePenalty',
                    label: 'Presence_penalty',
                    value: 0,
                    isSlider: true,
                    isStr: false,
                    sliderMin: -2,
                    sliderMax: 2,
                    sliderStep: 0.1
                },
                {
                    tips: '',
                    formField: 'stopSequences',
                    label: 'StopSequences',
                    value: '',
                    isSlider: false,
                    isStr: true,
                    sliderMin: 0,
                    sliderMax: 'Infinity',
                    sliderStep: 1
                }
            ]
        },
        // 配置 参数设置输入回调
        parameterInputHandle(val, item) {
            let {sliderMax, sliderMin, sliderStep, isStr, isSlider, formField} = item
            //console.log('parameterInputHandle:', val)
            let _findIdnex = this.parameterViewList.findIndex(item => item.formField === formField)
            let _findItem = this.parameterViewList[_findIdnex]
            // 根据 item里面的参数 判断限制输入的内容
            if (isStr) {
                // 字符串类型
            } else {
                // if (isSlider || isStr )
                //有滑动选择的 数据必须为数字
                let _val = val.replace(/[^\d]/g, '')
                //floor
                _val = Math.round(_val / sliderStep) * sliderStep
                //console.log('parameterInputHandle _val:', _val)
                //且小于sliderMax大于sliderMin保留位数与sliderStep一样
                if (_val < sliderMin) {
                    this.$set(this.parameterViewList, _findIdnex, {..._findItem, value: item.sliderMin})
                } else if (sliderMax === 'Infinity') {
                    this.$set(this.parameterViewList, _findIdnex, {..._findItem, value: _val})
                } else if (_val > sliderMax) {
                    this.$set(this.parameterViewList, _findIdnex, {..._findItem, value: item.sliderMax})
                } else {
                    this.$set(this.parameterViewList, _findIdnex, {..._findItem, value: _val})
                }
            }

        },
        // 配置 输入Prompt 重置 
        resetInputPrompt() {
            //console.log('输入Prompt 重置:', this.content)
            this.content = ''// prompt 输入内容
            //this.remarks = '' // prompt 输入的备注
        },

        //  prompt请求参数 关闭
        promptParamFormClose() {
            this.promptParamForm = {
                prefix: '',
                suffix: '',
                variableList: []
            }
            this.$refs.promptParamForm.resetFields();
            this.promptParamVisible = true;
        },
        // prompt请求参数 添加变量行btn
        addVariableBtn() {
            this.promptParamForm.variableList.push({
                name: '',
                value: ''
            })
        },
        // prompt请求参数 删除变量行btn
        deleteVariableBtn(index) {
            this.promptParamForm.variableList.splice(index, 1)
        },
        // prompt请求参数 提交
        promptParamFormSubmit() {
            this.$refs.promptParamForm.validate(async (valid) => {
                if (valid) {
                        console.log('promptParamSubmit:', this.promptParamForm)
                    //this.promptParamFormLoading = true
                    //const res = await service.post('/api/Senparc.Xncf.PromptRange/LlmModelAppService/Xncf.PromptRange_LlmModelAppService.Add', this.modelForm)
                    //if (res.data.success) {
                    //    this.promptParamFormLoading = false
                    //    let { prefix = '', suffix = '', variableList = [] } = this.promptParamForm

                    //    this.promptParamFormClose()
                    //} else {
                    //    this.promptParamFormLoading = false
                    //}
                } else {
                    return false;
                }
            });
            
        },

        // 配置 获取模型 下拉列表数据
        async getModelOptData() {
            let res = await service.get('/api/Senparc.Xncf.PromptRange/LlmModelAppService/Xncf.PromptRange_LlmModelAppService.GetIdAndName')
            //console.log('getModelOptData:', res)
            if (res.data.success) {
                //console.log('getModelOptData:', res.data)
                let _optList = res.data.data || []
                this.modelOpt = _optList.map(item => {
                    return {
                        ...item,
                        label: item.name,
                        value: item.id,
                        disabled: false
                    }
                })
            } else {
                alert('error');
            }
        },
        // 新增模型 dialog 关闭
        modelFormCloseDialog() {
            this.modelForm = {
                modelType: "", // string
                name: "", // string
                apiVersion: "", // string
                apiKey: "", // string
                endpoint: "", // string
                organizationId: "", // string
            }
            this.$refs.modelForm.resetFields();
        },
        // 新增模型 dialog 提交
        modelFormSubmitBtn() {
            this.$refs.modelForm.validate(async (valid) => {
                if (valid) {
                    this.modelFormSubmitLoading = true
                    const res = await service.post('/api/Senparc.Xncf.PromptRange/LlmModelAppService/Xncf.PromptRange_LlmModelAppService.Add', this.modelForm)
                    if (res.data.success) {
                        this.modelFormSubmitLoading = false
                        // 重新获取模型列表
                        this.getModelOptData()
                        // 关闭dialog
                        this.modelFormVisible = false
                    } else {
                        this.modelFormSubmitLoading = false
                    }
                } else {
                    return false;
                }
            });
        },


        // 关闭新增靶场 dialog
        fieldFormCloseDialog() {
            this.fieldForm = {
                fieldName: ''
            }
            this.$refs.fieldForm.resetFields();
        },
        // dialog 新增靶场 提交按钮
        fieldFormSubmitBtn() {
            this.$refs.fieldForm.validate(async (valid) => {
                if (valid) {
                    this.fieldFormVisible = false
                    //this.fieldFormSubmitLoading = true
                    //// todo 对接接口
                    //const res = await service.post('/api/Senparc.Xncf.PromptRange/LlmModelAppService/Xncf.PromptRange_LlmModelAppService.Add', this.fieldForm)
                    //this.fieldFormSubmitLoading = false
                    //if (res.data.success) {
                    //    // todo 重新获取靶场列表
                    //    // 关闭dialog
                    //    this.fieldFormVisible = false
                    //}
                } else {
                    return false;
                }
            });
        },
        // 配置 获取靶场 下拉列表数据
        async getFieldList(){
            await service.get('/api/Senparc.Xncf.PromptRange/PromptItemAppService/Xncf.PromptRange_PromptItemAppService.GetRangeNameList')
                .then(res=>{
                    if(res.data.success){
                        this.promptFieldOpt=res.data.data.map(item=>{
                            return {
                                ...item,
                                label:item.rangeName,
                                value:item.rangeName,
                                disabled:false
                            }
                        })
                    }
                })
        },
        // 获取靶道 下拉列表数据
        async getPromptOptData(id) {
            let res = await service
                .get('/api/Senparc.Xncf.PromptRange/PromptItemAppService/Xncf.PromptRange_PromptItemAppService.GetIdAndName',{
                    params: {
                        rangeName: this.promptField
                    }
                })
            if (res.data.success) {
                //console.log('getModelOptData:', res)
                let _optList = res.data.data || []
                this.promptOpt = _optList.map(item => {
                    const avg=scoreFormatter(item.evalAvgScore)
                    const max=scoreFormatter(item.evalMaxScore)
                    return {
                        ...item,
                        label: `版本号：${item.fullVersion} | 平均分：${avg} | 最高分：${max} ${item.isDraft?'(草稿)':''}`,
                        value: item.id,
                        disabled: false
                    }
                })
        
            } else {
                alert('error');
            }
        },
        // 获取 prompt 详情
        async getPromptetail(id, overwrite) {
            let res = await service.get(`/api/Senparc.Xncf.PromptRange/PromptItemAppService/Xncf.PromptRange_PromptItemAppService.Get?id=${Number(id)}`,)
            /*console.log('getPromptetail:', res)*/
            if (res.data.success) {
                //console.log('getPromptetail:', res.data)
                this.promptDetail = res.data.data
                if (overwrite) {
                    // 重新获取输出列表
                    this.getOutputList(this.promptDetail.id)
                    // 重新获取图表
                    this.getScoringTrendData()

                    // 参数覆盖
                    let _parameterViewList = JSON.parse(JSON.stringify(this.parameterViewList))
                    this.modelid = this.promptDetail.modelId
                    this.parameterViewList = _parameterViewList.map(item => {
                        if (item) {
                            item.value = this.promptDetail[item.formField] || item.value
                        }
                        return item
                    })
                    this.content = this.promptDetail.promptContent || '' // prompt 输入内容
                    this.remarks = this.promptDetail.note || ''  // prompt 输入的备注
                }


            } else {
                alert('error');
            }
        },
        // 删除 prompt 
        async btnDeleteHandle(id) {
            const res = await service.request({
                method: 'delete',
                url: `/api/Senparc.Xncf.PromptRange/PromptItemAppService/Xncf.PromptRange_PromptItemAppService.Del?id=${id}`,
                //data: {id:item.id} // 将 ID 列表作为请求体数据发送
            });
            if (res.data.success) {
                //重新获取 prompt列表
            } else {
                alert("error")
            }
        },
        // 修改 prompt 
        async btnEditHandle(item) {
            const res = await service.request({
                method: 'post',
                url: `/api/Senparc.Xncf.PromptRange/PromptItemAppService/Xncf.PromptRange_PromptItemAppService.Modify`,
                data: {
                    id: item.id,
                    name: item.name
                }
            });
            if (res.data.success) {
                //重新获取 prompt列表
            } else {
                alert("error")
            }
        },

        // ai评分设置 dialog 新增结果行btn
        aiScoreFormAddRow() {
            let _len = this.aiScoreForm.resultList.length
            this.aiScoreForm.resultList.push({
                id: _len + 1,
                label: `预期结果${_len + 1}`,
                value: ''
            })
        },
        // ai评分设置 打开 dialog 
        aiScoreFormOpenDialog() {
            if (this.promptDetail && this.promptDetail.expectedResultsJson) {
                let _expectedResultsJson = JSON.parse(this.promptDetail.expectedResultsJson)
                this.aiScoreForm = {
                    resultList:_expectedResultsJson.map((item, index) => {
                        return {
                            id: index + 1,
                            label: `预期结果${index + 1}`,
                            value: item
                        }
                    })
                }
            }
            this.aiScoreFormVisible = !this.aiScoreFormVisible
        },
        // 关闭ai评分设置 dialog
        aiScoreFormCloseDialog() {
            this.aiScoreForm = {
                resultList:[{
                    id: 1,
                    label: '预期结果1',
                    value: ''
                }]
            }
            this.$refs.aiScoreForm.resetFields();
        },
        // dialog ai评分设置 提交按钮
        aiScoreFormSubmitBtn() {
            this.$refs.aiScoreForm.validate(async (valid) => {
                if (valid) {
                    this.aiScoreFormSubmitLoading = true
                    let _list = this.aiScoreForm.resultList.map(item => item.value)
                    const res = await service.request({
                        method: 'post',
                        url: `/api/Senparc.Xncf.PromptRange/PromptItemAppService/Xncf.PromptRange_PromptItemAppService.UpdateExpectedResults`,
                        params: {
                            promptItemId: Number(this.promptid),
                            expectedResults: JSON.stringify(_list)
                        }
                    });
                    this.aiScoreFormSubmitLoading = false
                    if (res.data.success) {
                        // 重新获取详情
                        this.getPromptetail(this.promptid,false)
                        // 关闭dialog
                        this.aiScoreFormVisible = false
                    }
                } else {
                    return false;
                }
            });
        },
    }
});


function scoreFormatter(score){
    return score===-1?'--':score
}