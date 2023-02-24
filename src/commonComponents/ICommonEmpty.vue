<template>
    <div class="empty-container">
        <van-empty :description="propData.emptyText || '数据为空'">
            <template #image>
                <van-image
                    width="60"
                    height="60"
                    :src="IDM.url.getModuleAssetsWebPath(require('../assets/empty-default.png'), moduleObject)"
                />
            </template>
        </van-empty>
    </div>
</template>
<script>
export default {
    name: 'ICommonEmpty',
    props: {
        moduleObject: {
            type: Object,
            required: true
        },
        propData: {
            type: Object,
            required: true
        }
    }
}
</script>
<style lang="scss" scoped>
.empty-container {
    ::v-deep(.van-empty) {
        padding: 0;
    }
    ::v-deep(.van-empty__image) {
        width: auto;
        height: auto;
    }
}
</style>
