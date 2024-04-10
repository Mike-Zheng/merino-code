<template>
  <input
    class="vue-scrubber"
    v-model="constrainedValue"
    @mousedown="handleMouseDown"
    @keypress="handleInput"
    @keydown.up="handleKeyCodeUp"
    @keydown.down="handleKeyCodeDown"
    @change="handleChange"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";

export default defineComponent({
  props: {
    value: Number,
    min: Number,
    max: Number,
    steps: Number
  },
  setup(props) {
    const isMouseDown = ref(false);
    const initialMouse = { x: 0, y: 0 };
    const initialValue = ref(props.value);
    const currentValue = ref(props.value);

    const decimals = computed(() => {
      return (
        props.steps.toString().substr(props.steps.toString().indexOf("."))
          .length - 1
      );
    });

    const constrainedValue = computed(() => {
      return constrain(
        currentValue.value,
        props.min,
        props.max,
        decimals.value
      );
    });

    function constrain(
      value: number,
      min: number | undefined,
      max: number | undefined,
      decimals: number
    ): number {
      decimals = typeof decimals !== "undefined" ? decimals : 0;

      if (min !== undefined && max !== undefined) {
        return round(
          Math.min(Math.max(parseFloat(value.toString()), min), max),
          decimals
        );
      } else {
        return value;
      }
    }

    function round(value: number, decimals: number): number {
      return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
    }

    function handleInput(event: KeyboardEvent) {
      if (event.keyCode < 48 || event.keyCode > 57) {
        event.preventDefault();
      }
    }

    function handleChange(event: Event) {
      currentValue.value = isNaN(
        parseFloat((event.target as HTMLInputElement).value)
      )
        ? 0
        : parseFloat((event.target as HTMLInputElement).value);
    }

    function handleKeyCodeUp(event: KeyboardEvent) {
      event.preventDefault();
      currentValue.value += parseFloat(props.steps.toString());
    }

    function handleKeyCodeDown(event: KeyboardEvent) {
      event.preventDefault();
      currentValue.value -= parseFloat(props.steps.toString());
    }

    function handleMouseDown(event: MouseEvent) {
      isMouseDown.value = true;
      initialMouse.x = event.clientX;
      initialMouse.y = event.clientY;
      initialValue.value = currentValue.value;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    function handleMouseUp(event: MouseEvent) {
      isMouseDown.value = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    function handleMouseMove(event: MouseEvent) {
      if (isMouseDown.value) {
        const newValue =
          initialValue.value + (event.clientX - initialMouse.x) * props.steps;
        currentValue.value = constrain(
          newValue,
          props.min,
          props.max,
          decimals.value
        );
      }
    }

    onMounted(() => {
      currentValue.value = props.value;
    });

    onUnmounted(() => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    });

    return {
      constrainedValue,
      handleInput,
      handleChange,
      handleKeyCodeUp,
      handleKeyCodeDown,
      handleMouseDown
    };
  }
});
</script>

<style scoped>
/* Add your component's style here */
.vue-scrubber {
  /* Define your styles */
}
</style>
