let g:syntastic_css_checkers = ['stylelint']
let g:syntastic_css_stylelint_exec = '/home/tortuga/.local/share/pnpm/node_modules/.bin/stylelint'
let g:syntastic_mode_map = { 'mode': 'active', 'active_filetypes': [] }
let g:syntastic_css_stylelint_args = "--syntax=css"
let g:syntastic_css_filetypes = ['css', 'scss', 'less', 'stylus']
let g:syntastic_debug = 3
