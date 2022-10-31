
class Check {
    static classChecked = '--checked';
    static classError = '--error';

    constructor(element) {
        this.element = element;
        this.input = this.element.querySelector('input');
        this.type = this.input.type;
        this.checkChecked();
        this.onClick();
    }

    onClick() {
        this.element.addEventListener('click', () => {
            if (this.type == 'checkbox') {
                this.element.classList.toggle(Check.classChecked);
                this.checked = this.input.getAttribute('checked');

                if (this.checked) {
                    this.input.removeAttribute('checked');
                } else {
                    this.input.setAttribute('checked', 'checked');
                }

            } else if (this.type == 'radio') {
                if (this.element.closest(Check.classChecked)) {
                    return false;
                }

                this.name = this.input.name;
                let parent = this.element.closest('.checks') ? this.element.closest('.checks') : this.element.closest('form') ? this.element.closest('form') : document.body;
                let radios = parent.querySelectorAll('.check input[type="radio"][name="' + this.name + '"]');
                radios.forEach(radio => {
                    radio.removeAttribute('checked');
                    radio.closest('.check').classList.remove(Check.classChecked);
                });
                this.element.classList.add(Check.classChecked);
                this.input.setAttribute('checked', 'checked');
            }
        });
    }

    checkChecked() {
        if (this.input.getAttribute('checked')) {
            this.element.classList.add(Check.classChecked);
        }
    }

    static init() {
        const $checks = document.querySelectorAll('.check');
        if ($checks.length > 0) {
            $checks.forEach(($check) => {
                new Check($check);
            });
        }

    }

}



class Select {
    static classCurrent = '--current';
    static classOpen = '--open';
    static classDisabled = '--disabled';
    static classHide = '--hide';
    static classError = '--error';

    constructor(element, list) {
        this.element = element;
        this.list = list;
        this.items = [];
        this.isOpen = false;
        this.isDisabled = false;

        this.current = {
            $item: null,
            $option: null,
        };

        this.$value = this.element.querySelector('.select__value');
        this.$drop = this.element.querySelector('.select__drop');
        this.$field = this.element.querySelector('.select__field .field__area');
        this.$select = this.element.querySelector('select');

        if (this.list) {
            this.initList();

        } else {
            this.isDisabled = true;
            this.element.classList.add(Select.classDisabled);
        }

        this.element.addEventListener('change', () => {
            this.element.val = this.current.$option.innerText;
            if (this.$field) {
                this.$field.value = '';
                this.items.forEach(($item) => {
                    $item.classList.remove(Select.classHide);
                });
            }
        });

        this.element.addEventListener('click', (e) => {
            this.element.classList.remove(Select.classError);

            if (e.target.closest('.select__field')) {
                return false;
            }

            this.isOpen = !this.isOpen;
            window.currentOpenSelect = this.isOpen ? this : null;

            if (this.isOpen) {
                this.element.classList.add(Select.classOpen);
                if (this.$field) {
                    this.$field.focus();
                }
            } else {
                this.element.classList.remove(Select.classOpen);
            }
        });

        if (this.$field) {
            this.$field.addEventListener('input', () => {
                let val = this.$field.value.toLowerCase();

                this.items.forEach(($item) => {
                    if ($item.innerText.toLowerCase().indexOf(val) < 0) {
                        $item.classList.add(Select.classHide);
                    } else {
                        $item.classList.remove(Select.classHide);
                    }
                });
            });
        }

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.select')) {
                this.isOpen = false;
                this.element.classList.remove(Select.classOpen);
            };
        });

        this.element.Select = this;

        this.element.dispatchEvent(new Event('init'));
    }

    initList() {
        this.createElement('list', this.$drop);

        this.createItem('');

        this.list.forEach((item) => {
            let $item = this.createItem(item);

            $item.addEventListener('click', () => {
                this.setCurrent($item);
            });

        });
    }

    createElement(name, elementAppend) {
        let signature = '$' + name;
        this[signature] = document.createElement('div');
        this[signature].className = 'select__' + name;

        if (elementAppend) {
            elementAppend.append(this[signature])
        }
    }

    createItem(value) {
        let $item = document.createElement('div');
        $item.className = 'select__item';
        $item.innerHTML = value;

        let $option = document.createElement('option');
        $option.value = value;
        $option.innerText = value;

        $item.$option = $option;
        $option.$item = $item;


        if (value) {
            this.$list.append($item);
            this.items.push($item);
        }

        this.$select.append($option);

        return $item;
    }

    setCurrent($element) {
        if (this.current.$item) {
            this.current.$item.classList.remove(Select.classCurrent);
            this.current.$option.removeAttribute('selected');
        }

        this.current.$item = $element;
        this.current.$option = $element.$option;

        this.current.$item.classList.add(Select.classCurrent);
        this.current.$option.setAttribute('selected', 'selected');

        this.$value.innerText = $element.innerText;

        this.element.dispatchEvent(new Event('change'));
    }

    clear() {
        if (this.$list) {
            this.$list.remove();
            this.$select.innerHTML = this.$select.value = this.$value.innerHTML = this.element.val = '';
            this.items = [];
            this.isDisabled = true;
            this.element.classList.add(Select.classDisabled);
        }

    }

    update(list) {
        this.list = list;
        this.clear();

        this.isDisabled = false;
        this.element.classList.remove(Select.classDisabled);
        this.initList();
    }

}

document.addEventListener('DOMContentLoaded', () => {

    const $fields = document.querySelectorAll('.field');
    if ($fields) {
        $fields.forEach(($field) => {
            $field.$area = $field.querySelector('.field__area');

            $field.addEventListener('focusin', () => {
                $field.classList.remove('--error');
            });

            if ($field.classList.contains('--phone')) {
                IMask($field.$area, {
                    mask: '+{7} (000) 000-00-00'
                });
            }
        });
    }

    Check.init();

    const $calc = document.getElementById('calc');

    if ($calc) {
        $calc.$selectMark = document.getElementById('calc-mark');
        $calc.$selectModel = document.getElementById('calc-model');
        $calc.$selectEngine = document.getElementById('calc-engine');
        $calc.$selectYear = document.getElementById('calc-year');
        $calc.$selectType = document.getElementById('calc-type');

        $calc.addEventListener('submit', (e) => {
            e.preventDefault();
            let $fieldsRequired = $calc.querySelectorAll('.field.--required');
            let $selectsRequired = $calc.querySelectorAll('.select.--required');
            let errors = 0;


            $fieldsRequired.forEach(($field) => {
                if ($field.$area.value.length <= 3) {
                    $field.classList.add('--error');
                    errors++;
                }
                if ($field.classList.contains('--phone') && $field.$area.value.length < 18) {
                    $field.classList.add('--error');
                    errors++;
                }
            });

            $selectsRequired.forEach(($select) => {
                if (!$select.val) {
                    $select.classList.add('--error');
                    errors++;
                }
            });

            if (errors == 0) {
                // ajax
            } else {
                e.preventDefault();
            }

        });

        calcInit();
        async function calcInit() {
            let calcData = null;
            let response = await fetch('/calc-data.json');

            if (response.ok) {
                calcData = await response.json();
                let marks = calcData.marks.map((mark) => {
                    return mark.name;
                });


                new Select($calc.$selectMark, marks);
                new Select($calc.$selectModel);
                new Select($calc.$selectEngine, calcData.engines);
                new Select($calc.$selectYear, calcData.years);
                new Select($calc.$selectType, calcData.types);

                $calc.$selectMark.addEventListener('change', () => {
                    let currentMark = calcData.marks.find((mark) => {
                        if (mark.name == $calc.$selectMark.val) {
                            return mark;
                        }
                    });


                    $calc.$selectModel.Select.update(currentMark.models);
                });
            }
        }
    }
});