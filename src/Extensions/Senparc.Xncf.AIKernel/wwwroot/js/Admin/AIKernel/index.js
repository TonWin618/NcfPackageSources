var app = new Vue({
    el: "#app",
    data() {
        return {
            page: {
                page: 1,
                size: 10
            },
            tableLoading: true,
            tableData: [],
            addFormDialogVisible: false,
            neuCharFormDialogVisible: false, // 新增的对话框可见性  
            addForm: {
                alias: "",
                "modelId": "",
                "deploymentName": "",
                "endpoint": "",
                "aiPlatform": '4',
                "configModelType": '1',
                "organizationId": "",
                "apiKey": "",
                "apiVersion": "",
                "note": "",
                "maxToken": 0,
            },
            neuCharForm: { // 新增的表单数据  
                developerId: "",
                apiKey: ""
            },
            editFormDialogVisible: false,
            editForm: {
                alias: "",
                "modelId": "",
                "deploymentName": "",
                "endpoint": "",
                "aiPlatform": '4',
                "configModelType": '1',
                "organizationId": "",
                "apiKey": "",
                "apiVersion": "",
                "note": "",
                "maxToken": 0,
                "show": true
            },
            total: 0,
            addRules: {
                alias: [
                    { required: true, message: '请输入别名', trigger: 'change' }
                ],
                aiPlatform: [
                    { required: true, message: '请选择平台类型', trigger: 'change' }
                ],
                configModelType: [
                    { required: true, message: '请选择模型类型', trigger: 'change' }
                ],
                modelId: [
                    { required: true, message: '请输入模型名称', trigger: 'blur' }
                ],
                deploymentName: [
                    { required: true, message: '请输入模型部署名称', trigger: 'blur' }
                ],
                apiVersion: [
                    { required: true, message: '请输入API Version', trigger: 'blur' }
                ],
                apiKey: [
                    { required: true, message: '请输入API key', trigger: 'blur' }
                ],
                endpoint: [
                    { required: true, message: '请输入End Point', trigger: 'blur' }
                ],
                organizationId: [
                    { required: true, message: '请输入Organization Id', trigger: 'blur' }
                ]
            },
            neuCharRules: { // 新增的验证规则  
                developerId: [
                    { required: true, message: '请输入 DeveloperId', trigger: 'blur' }
                ],
                apiKey: [
                    { required: true, message: '请输入 ApiKey', trigger: 'blur' }
                ]
            },
            editRules: {
                alias: [
                    { required: true, message: '请输入别名', trigger: 'change' }
                ],
                aiPlatform: [
                    { required: true, message: '请选择平台类型', trigger: 'change' }
                ],
                configModelType: [
                    { required: true, message: '请选择模型类型', trigger: 'change' }
                ],
                modelId: [
                    { required: true, message: '请输入模型名称', trigger: 'blur' }
                ],
                deploymentName: [
                    { required: true, message: '请输入模型部署名称', trigger: 'blur' }
                ],
                apiVersion: [
                    { required: true, message: '请输入API Version', trigger: 'blur' }
                ],
                endpoint: [
                    { required: true, message: '请输入End Point', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        //wait page load  
        setTimeout(async () => {
            await this.init();
        }, 100)
    },
    methods: {
        async init() {
            await this.getDataList();
        },
        async handleSizeChange(val) {
            this.page.size = val;
            await this.getDataList();
        },
        async handleCurrentChange(val) {
            this.page.page = val;
            await this.getDataList();
        },
        async getDataList() {
            this.tableLoading = true
            await service.post('/api/Senparc.Xncf.AIKernel/AIModelAppService/Xncf.AIKernel_AIModelAppService.GetPagedListAsync', {
                "page": this.page.page,
                "size": this.page.size,
            })
                .then(res => {
                    console.log(res)
                    this.tableData = res.data.data.data;
                    this.total = res.data.data.total;
                    this.tableLoading = false
                })
        },
        addModel() {
            this.addFormDialogVisible = true;
        },
        addNeuCharModel() {
            this.neuCharFormDialogVisible = true; // 显示对话框  
        },
        copyInfo(key) {
            // 把结果复制到剪切板  
            const input = document.createElement('input')
            input.setAttribute('readonly', 'readonly')
            input.setAttribute('value', key)
            document.body.appendChild(input)
            input.select()
            input.setSelectionRange(0, 9999)
            if (document.execCommand('copy')) {
                document.execCommand('copy')
                //提示时展示'******'+key的后4位  
                this.$message.success(`已复制【******${key.slice(-4)}】！`)
            }
        },
        async addModelSubmit() {
            this.$refs.addForm.validate(async (valid) => {
                if (valid) {
                    this.addForm.aiPlatform = parseInt(this.addForm.aiPlatform)
                    this.addForm.configModelType = parseInt(this.addForm.configModelType)
                    this.addForm.maxToken = parseInt(this.addForm.maxToken)
                    await service.post('/api/Senparc.Xncf.AIKernel/AIModelAppService/Xncf.AIKernel_AIModelAppService.CreateAsync', {
                        ...this.addForm
                    }
                    ).then(res => {
                        this.$message({
                            type: res.data.success ? 'success' : 'error',
                            message: res.data.success ? '添加成功!' : '添加失败'
                        });
                        if (res.data.success) {
                            this.getDataList()
                            this.clearAddForm()
                            this.addFormDialogVisible = false;
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        async addNeuCharModelSubmit() {
            this.$refs.neuCharForm.validate(async (valid) => {
                if (valid) {
                    await service.post('/api/Senparc.Xncf.AIKernel/AIModelAppService/Xncf.AIKernel_AIModelAppService.GetNeuCharModels', {
                        developerId: this.neuCharForm.developerId,
                        apiKey: this.neuCharForm.apiKey
                    }).then(res => {
                        this.$message({
                            type: res.data.success ? 'success' : 'error',
                            message: res.data.message
                        });
                        if (res.data.success) {
                            this.getDataList()
                            this.clearNeuCharForm()
                            this.neuCharFormDialogVisible = false;
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        clearAddForm() {
            this.addForm = {
                "alias": "",
                "modelId": "",
                "deploymentName": "",
                "endpoint": "",
                "aiPlatform": '4',
                "configModelType": '1',
                "organizationId": "",
                "apiKey": "",
                "apiVersion": "",
                "note": "",
                "maxToken": 0,
            }
        },
        clearNeuCharForm() { // 新增的清理表单方法  
            this.neuCharForm = {
                developerId: "",
                apiKey: ""
            }
        },
        clearEditForm() {
            this.editForm = {
                "alias": "",
                "modelId": "",
                "deploymentName": "",
                "endpoint": "",
                "aiPlatform": '4',
                "configModelType": '1',
                "organizationId": "",
                "apiKey": "",
                "apiVersion": "",
                "note": "",
                "maxToken": 0,
                "show": true
            }
        },
        async editModelSubmit() {
            this.$refs.editForm.validate(async (valid) => {
                if (valid) {
                    this.editForm.aiPlatform = parseInt(this.editForm.aiPlatform)
                    this.editForm.configModelType = parseInt(this.editForm.configModelType)
                    this.editForm.maxToken = parseInt(this.editForm.maxToken)
                    // clear empty value  
                    for (const key in this.editForm) {
                        if (this.editForm.hasOwnProperty(key)) {
                            const element = this.editForm[key];
                            if (element === null || element === undefined) {
                                delete this.editForm[key]
                            }
                        }
                    }

                    await service.post('/api/Senparc.Xncf.AIKernel/AIModelAppService/Xncf.AIKernel_AIModelAppService.EditAsync', {
                        ...this.editForm
                    }).then(res => {
                        this.$message({
                            type: res.data.success ? 'success' : 'error',
                            message: res.data.success ? '编辑成功!' : '编辑失败'
                        });
                        if (res.data.success) {
                            this.clearEditForm()
                            this.getDataList()
                            this.editFormDialogVisible = false;
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        dateformatter(date) {
            return new Date(date).toLocaleString()
        },
        editModel(row) {
            this.editFormDialogVisible = true;
            this.editForm = {
                ...row,
                aiPlatform: row.aiPlatform.toString(),
                configModelType: row.configModelType.toString()
            };
        },
        deleteModel(row) {
            this.$confirm(`此操作将永久删除【${row.alias}】模型, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await service.delete('/api/Senparc.Xncf.AIKernel/AIModelAppService/Xncf.AIKernel_AIModelAppService.DeleteAsync', {
                    params: {
                        id: row.id
                    }
                }).then(async res => {
                    this.$message({
                        type: res.data.success ? 'success' : 'error',
                        message: res.data.success ? '删除成功!' : '删除失败'
                    });
                    await this.getDataList().then(() => {
                        if (this.tableData.length === 0 && this.page.page > 1) {
                            this.page.page--;
                            this.getDataList();
                        }
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
    },
});  
