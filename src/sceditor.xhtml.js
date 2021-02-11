/**
 * SCEditor
 * http://www.sceditor.com/
 *
 * Copyright (C) 2017, Sam Clarke (samclarke.com)
 *
 * SCEditor is licensed under the MIT license:
 *	http://www.opensource.org/licenses/mit-license.php
 *
 * @file SCEditor - A lightweight WYSIWYG BBCode and HTML editor
 * @author Sam Clarke
 */

import sceditor from './sceditor.js';
import plugin from './formats/xhtml.js';

sceditor.format = plugin;

export default sceditor;
