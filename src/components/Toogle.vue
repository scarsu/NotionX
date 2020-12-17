<template>
  <div class="toogle">
    <input type="checkbox" :id="id"/>
    <label :for="id">
      {{text}}
      <svg aria-hidden="true" style="width:1em;height:1em;">
        <use xlink:href="#icon-collapse"></use>
      </svg>
    </label>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// filelog:
export default {
  name: 'Toogle',
  props: {
    text: String,
    id: {
      type: String,
      required: true
    }
  },
}
</script>
<style scoped>
.toogle input{
  display: none;
}
.toogle label{
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  letter-spacing: 0.03em;
  font-size: 11.5px;
  line-height: 1;
  margin-bottom: 1px;
  display: inline-block;
  text-transform: uppercase;
  cursor: pointer;
  user-select: none;
  color: var(--fontColor);
  font-weight: 600;
  transition: color 0s ease 0s, background-color 100ms ease-out 0s;
  margin: 10px 0 5px 0;
}
.toogle label svg{
  width: 1em;
  height: 1em;
  position: relative;
  top: 1.5px;
  fill: var(--fontColor);
}
.toogle label:hover{
  color: var(--fontColorDark);
  background-color: rgba(55, 53, 47, 0.08);
}
.toogle label:hover svg{
  fill: var(--fontColorDark);
}
.toogle > input + label + .content{
  display: block;
}
.toogle > input:checked + label + .content{
  display: none;
}
</style>
