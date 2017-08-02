# Form object

Use this form object inside your Vue components to send data using axios to a Laravel application.

## Usage

```vue
<template>
    <form @submit.prevent="submit">
        <!-- Apply custom classes when a filed has an error -->
        <div :class="{ 'has-error': form.errors.has('name') }">

            <!-- No need to attach your component data to the form object -->
            <input type="text" v-model="user.name">

            <!-- Display the error message for a field -->
            <div class="error" v-show="form.errors.has('name')" v-text="form.errors.get('name')"></div>

            <!-- Disable buttons using form.isPending -->
            <button type="submit" :disabled="form.isPending">Submit</button>

            <!-- Get upload progress percentage using form.progress -->
            <div class="progress-bar">
                <div :style="{width: form.progress + '%'}"></div>
            </div>
        </div>
    </form>
</template>

<script>
import Form from 'form-object';

export default {
    data() {
        user: {name: 'Sahib'},
        form: new Form()
    },

    methods: {
        submit() {
            this.form.submit('post', '/users', this.user).then(data => {
                // Handle response data
            }).catch(error => {
                // Handle request errors
            });
        }
    }
}
</script>
```
