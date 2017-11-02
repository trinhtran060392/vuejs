<template>
	<div class="main-layout">
		<nav>
      <p>This is my nav</p>
      <router-link to="login">Login</router-link>
    </nav>
		<router-view/>
		<footer>This is my footer</footer>
	</div>
</template>

<style type="text/css">
  footer {
    background: #d8d8d8;
    padding: 20px;
  }
  nav {
    background: #e8e8e8;
    padding: 20px;
  }
  .content {
    padding: 20px;
  }
</style>