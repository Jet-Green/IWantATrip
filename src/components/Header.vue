<script setup>
</script>


<template>
  <a-layout-header>
    <a-row type="flex" justify="center">
      <a-col :xs="24" :sm="20">
        <a-row>
          <a-col :span="12">
           <span
                class="mdi mdi-24px mdi-gnome"
              style="color:#245159"
              ></span>
          Хочу в поездку</a-col>
          <a-col :span="12" class="top_menu" justify="space-around">
            <div>найти тур</div>
            <div>создать тур</div>
            <div>попутчики</div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-layout-header>
</template>


<style lang="scss" scoped>
.ant-layout-header{  
    text-transform: uppercase;
    
  
   .top_menu{
    display: flex;
    justify-content: space-around;
  
} 
}

</style>