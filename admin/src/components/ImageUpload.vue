// ImageUpload.vue 
<template>
  <div class="m-image-upload">
    <!--
      这里分为两段遍历，理由是：在编辑情况下要默认为组件添加默认数据，虽然说组件提供了 `add` 方法，
        但在编辑状态下，需要把 url 形式的图片转换成 File 之后才可以添加进去，略微麻烦。
        所以分两次遍历，一次遍历表单对象里的图片（直接用img标签展示，新上传的图片可以通过 blob 来赋值 src），第二次遍历组件里的 files
    -->
    <div
      class="file-item"
      v-for="(file, index) in value">
      <img
        :src="file.thumb || file.url"
        @click="preview(index)"
      />
      <van-icon
        name="clear"
        class="close"
        @click="remove(index, true)"/>   <!-- 把图片从数组中删除 -->
    </div>
    <div
      :class="{'file-item': true, 'active': file.active, 'error': !!file.error}"
      v-for="(file, index) in files">  <!-- 加几个样式来控制 `上传中` 和 `上传失败` 的样式-->
      <img
        v-if="file.blob"
        :src="file.blob"
      />
      <div class="uploading-shade">
        <p>{{ file.progress }} %</p>
        <p>正在上传</p>
      </div>
      <div class="error-shade">
        <p>上传失败！</p>
      </div>
      <van-icon
        name="clear"
        class="close"
        @click="remove(index)"
      />
    </div>
    <file-upload
      ref="uploader"
      v-model="files"
      multiple
      :thread="10"
      extensions="jpg,gif,png,webp"
      post-action="http://localhost:3000/file/upload"
      @input-file="inputFile"
      @input-filter="inputFilter"
    >
      <van-icon name="photo"/>
    </file-upload>
  </div>
</template>

<script>
  /**
   * 图片上传控件
   * 使用方法：
      import ImageUpload from '@/components/ImageUpload'
      ...
      components: {
        ImageUpload
      },
      ...
      <image-upload :value.sync="pics"/>
   */
  import uploader from 'vue-upload-component'
  import ImageCompressor from 'image-compressor.js';
  import { ImagePreview } from 'vant';

  export default {
    name: 'ImageUpload',
    props: {
      value: Array // 通过`.sync`来添加更新值的语法题，通过 this.$emit('update:value', this.value) 来更新
    },
    data() {
      return {
        files: [] // 存放在组件的file对象
      }
    },
    components: {
      'file-upload': uploader
    },
    methods: {
      // 当 add, update, remove File 这些事件的时候会触发
      inputFile(newFile, oldFile) {
        // 上传完成
        if (newFile && oldFile && !newFile.active && oldFile.active) {
          // 获得相应数据
          if (newFile.xhr && newFile.xhr.status === 200) {
            newFile.response.data.thumb = newFile.thumb // 把缩略图转移
            this.value.push(newFile.response.data) // 把 uploader 里的文件赋值给 value
            this.$refs.uploader.remove(newFile) // 删除当前文件对象
            this.$emit('update:value', this.value) // 更新值
          }
        }

        // 自动上传
        if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
          if (!this.$refs.uploader.active) {
            this.$refs.uploader.active = true
          }
        }
      },
      // 文件过滤，可以通过 prevent 来阻止上传
      inputFilter(newFile, oldFile, prevent) {
        if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
          // 自动压缩
          if (newFile.file && newFile.type.substr(0, 6) === 'image/') { // && this.autoCompress > 0 && this.autoCompress < newFile.size（小于一定尺寸就不压缩）
            newFile.error = 'compressing'
            // 压缩图片
            const imageCompressor = new ImageCompressor(null, {
              quality: .5,
              convertSize: Infinity,
              maxWidth: 1000,
            })
            imageCompressor.compress(newFile.file).then((file) => {
              // 创建 blob 字段 用于图片预览
              newFile.blob = ''
              let URL = window.URL || window.webkitURL
              if (URL && URL.createObjectURL) {
                newFile.blob = URL.createObjectURL(file)
              }
              // 缩略图
              newFile.thumb = ''
              if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
                newFile.thumb = newFile.blob
              }
              // 更新 file
              this.$refs.uploader.update(newFile, {error: '', file, size: file.size, type: file.type})
            }).catch((err) => {
              this.$refs.uploader.update(newFile, {error: err.message || 'compress'})
            })
          }
        }
      },
      remove(index, isValue) {
        if (isValue) {
          this.value.splice(index, 1)
          this.$emit('update:value', this.value)
        } else {
          this.$refs.uploader.remove(this.files[index])
        }
      },
      preview(index) {
        ImagePreview({
          images: this.value.map(item => (item.thumb || item.url)),
          startPosition: index
        });
      }
    }
  }
</script>