import { insert } from './api.js';

await insert({
    suffix: {
        rules: [
            'y im y',
            'y in y',
            'y iko y',
            'y inao y',
            'y iny y',
            'y intsika y',
            'y inay y',
            'y inareo y'
        ], match: 'y$'
    }
})

await insert({
    suffix: {
        rules: [
            '0 m [aeo]',
            '0 n [aeo]',
            '0 ko [aeo]',
            '0 nao [aeo]',
            '0 ny [aeo]',
            '0 ntsika [aeo]',
            '0 nay [aeo]',
            '0 nareo [aeo]'
        ], match: '[aeo]$'
    }
})

await insert({
    suffix: {
        rules: [
            'a 0 .',
            'ka 0 .',
            'ka ky .',
            'a o .',
            'a ao .',
            'ka ny .',
            'ka tsika .',
            '0 y .',
            '0 reo .'
        ], match: 'ka$'
    }
})

await insert({
    suffix: {
        rules: [
            'a 0 .',
            'tra 0 .',
            'try 0 .',
            'a o .',
            'tra ko .',
            '0 o .',
            'tra ny .',
            'tra tsika .',
            '0 y .',
            '0 reo .'
        ], match: 'tra$'
    }
})

await insert({
    suffix: {
        rules: [
            'na m .',
            'a 0 .',
            'na ko .',
            '0 o .',
            'a y .',
            'a tsika .',
            '0 reo .'
        ], match: 'na$'
    }
})

await insert({
    prefix: {
        rules: [
            '0 m [aeio]',
            '0 n [aeio]',
            '0 h [aeio]'
        ], match: '^[aeio]'
    }
})

await insert({
    prefix: {
        rules: [
            '0 m [aeio]',
            '0 n [aeio]',
            '0 h [aeio]'
        ], match: '^[aeio]'
    }
})

await insert({
    suffix: {
        rules: [
            'a 0 .',
            'tra 0 .',
            'try 0 .',
            'tra ko .',
            '0 o .',
            'tra ny .',
            'tra tsika .',
            '0 y .',
            '0 reo .'
        ], match: 'tra$'
    }
})

await insert({
    suffix: {
        rules: [
            'a 0 .',
            'tra 0 .',
            'try 0 .',
            'tra ko .',
            '0 o .',
            'tra ny .',
            'tra tsika .',
            '0 y .',
            '0 reo .'
        ], match: 'tra$'
    }
})

await insert({
    prefix: {
        rules: [
            '0 mi .',
            '0 ni .',
            '0 hi .',
            '0 ki .',
            '0 mpi .',
            '0 fi .',
            '0 pi .',
            '0 mifampi .',
            '0 nifampi .',
            '0 hifampi .',
            '0 kifampi .'
        ], match: '^[^i]'
    }
})