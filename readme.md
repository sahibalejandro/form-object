# Form object

Form Object is a simple layer on top of axios, it understands the Laravel validation error
responses and handles it for you, now you can focus on the feedback you want to give to
the users.

## Installation

```bash
# Using the legendary NPM
npm install form-object --save

# Or using Yarn
yarn add form-object
```

## Usage

```vue
<template>
    <form @submit.prevent="submit">
        <!-- Apply custom classes when a field has an error -->
        <div :class="{ 'has-error': form.errors.has('name') }">

            <!-- No need to attach your component data to the form object -->
            <input type="text" v-model="user.name">

            <!-- Display the error message for a specific field -->
            <div class="error" v-show="form.errors.has('name')" v-text="form.errors.get('name')"></div>

            <!-- Or display all error messages for specific field -->
            <div v-for="(error, key) in form.errors.getAll('name')" :key="key" v-text="error"></div>

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
                // This is the data returned from your server.
                console.log(data);
            }).catch(error => {
                // Handle request errors.
            });
        }
    }
}
</script>
```

### Clear messages
You can get rid of all error messages calling the `clear` method that belongs to the `Errors` object, like this:

```javascript
this.form.errors.clear();
```

Take note that all messages are removed automatically before sending the request, and in case you need to clear
an specific error message just pass the field's name to the `clear` method, like this:

```javascript
this.form.errors.clear('email');
```

In this way only that one will be removed from the error messages list.