<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- 卡片容器 -->
      <el-card class="mb-6" v-loading="loading">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <el-icon class="mr-2 text-blue-500"><User /></el-icon>
              <span class="text-lg font-medium">
                {{ isCurrentUser ? '个人信息' : (userProfile.username ? `${userProfile.username} 的个人资料` : '用户信息') }}
              </span>
            </div>
            
            <!-- 编辑按钮 - 右上角 (仅对自己显示) -->
            <div v-if="canEdit">
              <el-tooltip content="编辑资料" placement="top" v-if="!isEditing">
                <el-button type="primary" circle @click="startEditing">
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
              
              <div v-else class="flex space-x-2">
                <el-button @click="cancelEditing" plain>取消</el-button>
                <el-button type="primary" @click="saveProfile" :loading="isSaving">保存</el-button>
              </div>
            </div>
          </div>
        </template>
        
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- 左侧头像区 -->
          <div class="lg:col-span-1 flex flex-col items-center">
            <div class="relative mb-6">
              <!-- 增加头像预览和上传交互 -->
              <div 
                class="cursor-pointer relative group" 
                @click="handleAvatarClick"
              >
                <el-avatar 
                  :size="120" 
                  v-if="userProfile.avatar && userProfile.avatar !== '/UserUpload/user_default.png'"
                  :src="getImageUrl(userProfile.avatar)"
                ></el-avatar>
                <el-avatar 
                  :size="120" 
                  v-else
                  class="bg-blue-500"
                >{{ userProfile.username ? userProfile.username.charAt(0).toUpperCase() : '?' }}</el-avatar>
                
                <!-- 悬停提示蒙层，只对自己的头像显示上传提示 -->
                <div class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span class="text-white text-xs">
                    {{ canEdit && isEditing ? '更换头像' : '查看头像' }}
                  </span>
                </div>
              </div>
              
              <!-- 头像上传按钮，只在编辑模式下显示 -->
              <el-tooltip content="更换头像" placement="top" effect="light" v-if="canEdit && isEditing">
                <el-button 
                  class="absolute right-0 bottom-0" 
                  size="small" 
                  type="primary" 
                  circle 
                  @click="() => document.getElementById('avatar-upload').click()"
                >
                  <el-icon><Camera /></el-icon>
                </el-button>
              </el-tooltip>
              <input id="avatar-upload" type="file" @change="uploadAvatar" class="hidden" accept="image/*" />
            </div>
            
            <h2 class="text-lg font-medium mb-2">{{ userProfile.username }}</h2>
            
            <div class="flex flex-wrap justify-center gap-2 mb-6">
              <el-tag type="info">ID: {{ userProfile.uid }}</el-tag>
              <el-tag type="success">{{ roleLabels[userProfile.role] || '普通用户' }}</el-tag>
            </div>
          </div>
          
          <!-- 右侧信息区 -->
          <div class="lg:col-span-3">
            <el-tabs type="border-card">
              <el-tab-pane>
                <template #label>
                  <div class="flex items-center">
                    <el-icon><InfoFilled /></el-icon>
                    <span class="hidden sm:inline-block ml-1">基本资料</span>
                    <span class="sm:hidden ml-1">基本</span>
                  </div>
                </template>
                
                <!-- 个人简介 -->
                <div class="mb-6">
                  <div class="text-gray-500 text-sm mb-1">个人简介</div>
                  <div v-if="!isEditing" class="p-3 bg-gray-100 rounded text-gray-700">
                    {{ userProfile.introduction || '这个人很懒，什么都没有留下' }}
                  </div>
                  <el-input
                    v-else
                    v-model="editForm.introduction"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入个人简介"
                  />
                </div>
                
                <!-- 基本信息表单 -->
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="性别">
                    <template v-if="!isEditing">
                      {{ genderLabels[userProfile.gender] || '保密' }}
                    </template>
                    <template v-else>
                      <el-select v-model="editForm.gender" placeholder="请选择性别" class="w-full">
                        <el-option :value="1" label="男" />
                        <el-option :value="2" label="女" />
                        <el-option :value="3" label="保密" />
                      </el-select>
                    </template>
                  </el-descriptions-item>
                  
                  <el-descriptions-item label="教育背景">
                    <template v-if="!isEditing">
                      {{ userProfile.education || '未设置' }}
                    </template>
                    <template v-else>
                      <el-input v-model="editForm.education" placeholder="请输入教育背景" />
                    </template>
                  </el-descriptions-item>
                </el-descriptions>
              </el-tab-pane>
              
              <el-tab-pane v-if="isCurrentUser">
                <template #label>
                  <div class="flex items-center">
                    <el-icon><Message /></el-icon>
                    <span class="hidden sm:inline-block ml-1">联系方式</span>
                    <span class="sm:hidden ml-1">联系</span>
                  </div>
                </template>
                
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="邮箱地址">
                    <template v-if="!isEditing">
                      {{ userProfile.email || '未设置' }}
                    </template>
                    <template v-else>
                      <el-input v-model="editForm.email" placeholder="请输入邮箱地址" />
                    </template>
                  </el-descriptions-item>
                </el-descriptions>
              </el-tab-pane>
              
              <el-tab-pane>
                <template #label>
                  <div class="flex items-center">
                    <el-icon><CollectionTag /></el-icon>
                    <span class="hidden sm:inline-block ml-1">专业技能</span>
                    <span class="sm:hidden ml-1">技能</span>
                  </div>
                </template>
                
                <div v-if="!isEditing" class="p-4">
                  <div v-if="userProfile.skills" class="flex flex-wrap gap-2">
                    <el-tag 
                      v-for="skill in splitSkills(userProfile.skills)" 
                      :key="skill"
                      class="mb-2"
                    >
                      {{ skill.trim() }}
                    </el-tag>
                  </div>
                  <el-empty v-else description="未设置任何技能" />
                </div>
                <div v-else>
                  <div class="text-gray-500 text-sm mb-2">请使用逗号（中文或英文）分隔多个技能</div>
                  <el-input
                    v-model="editForm.skills"
                    placeholder="例如: JavaScript, Vue, UI设计，产品管理"
                  />
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-card>
    </div>
  </div>
  
  <!-- 添加头像预览对话框 -->
  <el-dialog v-model="avatarPreviewVisible" width="auto" align-center destroy-on-close>
    <img 
      v-if="userProfile.avatar && userProfile.avatar !== '/UserUpload/user_default.png'" 
      :src="getImageUrl(userProfile.avatar)" 
      alt="头像预览" 
      class="max-h-[80vh] max-w-[80vw]"
    />
    <el-avatar 
      v-else
      :size="200" 
      class="bg-blue-500"
    >{{ userProfile.username ? userProfile.username.charAt(0).toUpperCase() : '?' }}</el-avatar>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, h, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { getUserProfile, updateUserProfile, uploadUserAvatar } from '@/utils/api';
import { getImageUrl } from '@/utils/imageUrl';
import { useRoute, useRouter } from 'vue-router';
import { 
  User, 
  Camera, 
  Edit, 
  InfoFilled, 
  Message,
  CollectionTag
} from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const userProfile = ref({});
const isEditing = ref(false);
const isSaving = ref(false);
const avatarPreviewVisible = ref(false); // 控制头像预览弹窗
const loading = ref(false);

// 计算属性，判断是否是当前登录用户的个人资料
const isCurrentUser = computed(() => {
  // 如果URL中没有uid参数，或者uid参数等于当前登录用户的uid，则表示是当前用户
  const uidParam = route.query.uid;
  return !uidParam || (userStore.isLoggedIn() && uidParam === userStore.uid);
});

// 是否可以编辑
const canEdit = computed(() => {
  return isCurrentUser.value && userStore.isLoggedIn();
});

const editForm = ref({
  gender: 3,
  introduction: '',
  email: '',
  education: '',
  skills: ''
});

// 角色标签
const roleLabels = {
  1: '管理员',
  2: '编辑',
  3: '普通员工',
  4: '游客'
};

// 性别标签
const genderLabels = {
  1: '男',
  2: '女',
  3: '保密'
};

// 获取用户信息
const fetchUserProfile = async () => {
  try {
    loading.value = true;
    
    // 从URL参数获取uid，如果没有则获取当前用户信息
    const uidParam = route.query.uid;
    
    // 这里应调用后端API获取用户信息
    // 如果是获取当前用户，则使用getUserProfile
    // 如果是获取其他用户，则需要后端提供getUserById等API
    const response = await getUserProfile(uidParam || null);
    
    if (response.data.success) {
      userProfile.value = response.data.data;
      
      // 只有当查看自己的信息时才初始化编辑表单
      if (isCurrentUser.value) {
        // 初始化编辑表单
        editForm.value = {
          gender: userProfile.value.gender || 3,
          introduction: userProfile.value.introduction || '',
          email: userProfile.value.email || '',
          education: userProfile.value.education || '',
          skills: userProfile.value.skills || ''
        };
      }
    } else {
      ElMessage.error(response.data.message || '获取用户信息失败');
      // 如果获取失败且是访问他人信息，跳转回首页
      if (uidParam) {
        router.push('/');
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    ElMessage.error('获取用户信息失败，请稍后再试');
    
    // 如果是访问他人信息，跳转回首页
    if (route.query.uid) {
      router.push('/');
    }
  } finally {
    loading.value = false;
  }
};

// 开始编辑
const startEditing = () => {
  isEditing.value = true;
};

// 取消编辑
const cancelEditing = () => {
  isEditing.value = false;
  // 重置表单
  editForm.value = {
    gender: userProfile.value.gender || 3,
    introduction: userProfile.value.introduction || '',
    email: userProfile.value.email || '',
    education: userProfile.value.education || '',
    skills: userProfile.value.skills || ''
  };
};

// 保存个人资料
const saveProfile = async () => {
  try {
    isSaving.value = true;
    const response = await updateUserProfile(editForm.value);
    if (response.data.success) {
      userProfile.value = response.data.data;
      isEditing.value = false;
      ElMessage.success('保存成功');
    } else {
      ElMessage.error(response.data.message || '保存失败');
    }
  } catch (error) {
    console.error('保存个人资料失败:', error);
    ElMessage.error('保存失败，请稍后再试');
  } finally {
    isSaving.value = false;
  }
};

// 处理头像点击
const handleAvatarClick = () => {
  if (isEditing.value) {
    // 编辑模式下点击头像触发上传
    document.getElementById('avatar-upload').click();
  } else {
    // 非编辑模式下预览头像
    avatarPreviewVisible.value = true;
  }
};

// 上传头像
const uploadAvatar = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件');
    return;
  }

  // 验证文件大小
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过5MB');
    return;
  }

  try {
    // 创建FormData
    const formData = new FormData();
    formData.append('avatar', file);

    // 显示预览和确认对话框
    const reader = new FileReader();
    reader.onload = async (e) => {
      // 显示预览和确认对话框
      try {
        await ElMessageBox.confirm(
          h('div', { class: 'text-center' }, [
            h('p', { class: 'mb-4' }, '确认使用这张图片作为新头像吗？'),
            h('img', { 
              src: e.target.result, 
              class: 'max-h-[200px] max-w-[200px] mx-auto rounded' 
            })
          ]),
          '更换头像',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info'
          }
        );
        
        // 用户确认，上传头像
        const response = await uploadUserAvatar(formData);
        if (response.data.success) {
          userProfile.value.avatar = response.data.data.avatar;
          ElMessage.success('头像上传成功');
        } else {
          ElMessage.error(response.data.message || '头像上传失败');
        }
      } catch (cancelError) {
        // 用户取消，不做任何操作
      }
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('上传头像失败:', error);
    ElMessage.error('上传失败，请稍后再试');
  }
};

// 分割技能字符串，同时支持中英文逗号
const splitSkills = (skillsString) => {
  if (!skillsString) return [];
  // 将中文逗号替换为英文逗号，然后按英文逗号分割
  return skillsString.replace(/，/g, ',').split(',').filter(skill => skill.trim() !== '');
};

// 页面加载时获取用户信息
onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
/* 全局过渡效果 */
:deep(.el-input__inner),
:deep(.el-button),
:deep(.el-tag) {
  transition: all 0.3s;
}

/* 标签样式 */
:deep(.el-descriptions__label) {
  width: 100px;
}

/* 卡片内边距 */
:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-tabs--border-card) {
  box-shadow: none;
  border: 1px solid #ebeef5;
}
</style> 