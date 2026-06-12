# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Как сформировать Pull Request в production

Ветка `production` защищена, прямой `push` в неё запрещён. Используйте workflow через PR:

1. Обновите `production` локально:
	```bash
	git switch production
	git pull
	```

2. Создайте рабочую ветку от `production`:
	```bash
	git switch -c fix/short-description
	```

3. Внесите изменения и сделайте commit:
	```bash
	git add .
	git commit -m "Краткое описание изменений"
	```

4. Запушьте рабочую ветку:
	```bash
	git push -u origin fix/short-description
	```

5. Создайте PR в `production`:
	- Через GitHub UI по ссылке, которую покажет `git push`, или
	- Через GitHub CLI:
	  ```bash
	  gh pr create --base production --head fix/short-description --fill
	  ```

6. Дождитесь прохождения CI и review, затем выполните merge PR.
