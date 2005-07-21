# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================
"""
Gallery block can render a group of images, each with desciptions and zoom in on
a single image
"""

import logging
import gettext
import urllib
from exe.webui.block            import Block
from exe.webui                  import common
from exe.webui.element          import TextElement

log = logging.getLogger(__name__)
_   = gettext.gettext

# ===========================================================================
class EasyBlock(Block):
    """
    Wraps a few simple things in the block
    """

    def __init__(self, parent, idevice, name):
        Block.__init__(self, parent, idevice)
        self.name = name

    def process(self, request):
        """
        Handles a few nice commands and relays them to onXYZ handlers
        """
        object = request.args.get('object', [''])[0]
        if object != self.id:
            Block.process(self, request)
            return 
        

class GalleryBlock(Block):
    """
    Gallery block can render a group of images, each with desciptions and zoom
    in on a single image.

    Each of the GalleryImages owned by our GalleryIdevice is identified by its
    index in the 'self.idevice' list.
    """

    # Default Attribute Values
    thumbnailsPerRow = 5
    thumbnailSize = (96, 76)

    def __init__(self, parent, idevice):
        """
        'parent' is our parent 'Renderable' instance
        """
        Block.__init__(self, parent, idevice)
        
    # Protected Methods

    def _generateTable(self, perCell):
        """
        Generates a table of images,
        'perCell' is called and the result put in each cell, it should take one
        argument, which is an 'exe.engine.galleryIdevice.GalleryImage' instance
        and return a list of strings that will be later joined with '\n' chars.
        """
        html = [u'<table width="100%" border="1" cellpadding="3" '
                 'cellspacing="3">',
                u'  <tbody>',
                u'    <tr>']
        thumbnailsThisRow = 0
        for image in self.idevice.images:
            if thumbnailsThisRow % self.thumbnailsPerRow == 0:
                html += ['    </tr>']
            html += [u'      <td>']
            html += perCell(image)
            html += [u'      </td>']
            thumbnailsThisRow += 1
        html += [u'    </tr>',
                 u'  </tbody>',
                 u'</table>']
        return html

    # Public Methods

    def process(self, request):
        """
        Handles a post from the webui and changes our state accordingly
        """
        log.debug("process " + repr(request.args))
        # If the commit is not to do with us forget it
        object = request.args.get('object', [''])[0]
        if object != self.id:
            Block.process(self, request)
            return 
        # Separate out the action we want to do and the params
        action = request.args.get('action', [''])[0]
        if action.startswith('gallery.'):
            action, params = action.split('.', 2)[1:]
            # There are certain events that we only care about when in edit mode
            if self.mode == Block.Edit:
                # See if we will delete an image
                # Add an image
                if action == 'addImage':
                    # Decode multiple filenames
                    filenames = map(urllib.unquote, params.split('&'))
                    for filename in filenames: self.idevice.addImage(filename)
                # Edit/change an image
                if action == 'changeImage':
                    data = params.split('.', 2)
                    imageId = '.'.join(data[:2])
                    filename = data[2]
                    self.idevice.images[imageId].imageFilename = filename
                # Delete an image?
                if action == 'delete':
                    del self.idevice.images[params]
        elif self.mode == Block.Edit:
            # Check all the image captions for changes
            for image in self.idevice.images:
                # See if the caption has changed
                newCaption = request.args.get('caption'+image.id, [None])[0]
                if newCaption is not None:
                    image.caption = newCaption
        # Let our ancestor deal with the rest
        Block.process(self, request)
        
    def renderEdit(self, style):
        """
        Renders an editable array or 
        """
        html = [u'<div class="iDevice">',
                u'<p>',
                u'  <a href="javascript:addGalleryImage(\'%s\')">' % self.id,
                u'    Click here to add images',
                u'  </a>',
                common.hiddenField('newImagePath'+self.id),
                u'</p>']
        if len(self.idevice.images) == 0:
            html += [u'<div style="align:center center">',
                     u'  No Images Loaded',
                     u'</div>']
        else:
            def genCell(image):
                """Generates a single cell of our table"""
                changeGalleryImage = [
                        u'           onclick="changeGalleryImage(' +
                        u"'%s', '%s')" % (self.id, image.id),
                        u'"']
                return [u'          <img',] + \
                        changeGalleryImage + \
                       [u'           alt="%s"' % image.caption,
                        u'           src="%s"/>' % image.thumbnailSrc,
                        u'        <span>',
                        u'        <input id="caption%s" ' % image.id,
                        u'               name="caption%s" ' % image.id,
                        u'               value="%s" ' % image.caption,
                        u'               style="align:center;width:98%;"/>',
                        u'          <img '] + \
                        changeGalleryImage + \
                       [u'               src="/images/stock-edit.png"/>',
                        u'        </a>',
                        u'        <a href="javascript:submitLink(',
                        u'''         'gallery.delete.%s', %s, true)">''' % (image.id, self.id),
                        u'          <img src="/images/stock-delete.png"/>',
                        u'        </a>',
                        u'         '+common.hiddenField('path'+image.id),
                        u'         '+common.hiddenField('zoomIn'+image.id)]
            html += self._generateTable(genCell)
        html += [self.renderEditButtons(),
                 u'</div>']
        return u'\n    '.join(html).encode('utf8')

    def processDelete(self, request):
        """
        Override's deleting the Idevice to remove all the package resource files
        too.
        """
        for image in self.idevice.images[::-1]:
            image.delete()
        Block.processDelete(self, request)
        
    def renderEditSingleImage(self, style):
        """
        Renders a single image, and allows the user to change its text
        """

    def renderPreview(self, style):
        """
        Renders the HTML for preview inside exe
        """
        html  = [u'<div class="iDevice emphasis%s" ' %
                 unicode(self.idevice.emphasis),
                 u' ondblclick="submitLink(\'edit\',%s, 0);">' % self.id]
        html += self.renderSharedView(style)
        html += [self.renderViewButtons(),
                 u'</div>']
        return u'\n    '.join(html).encode('utf8')

    def renderSharedView(self, style):
        """
        HTML shared by view and preview
        """
        if len(self.idevice.images) == 0:
            html = [u'<div style="align:center center">',
                    u'  No Images Loaded',
                    u'</div>']
        else:
            def genCell(image):
                """
                Generates a single table cell
                """
                w, h = image.size
                return [u'        <img onclick="javascript:window.open(',
                        u"'%s', 'galleryImage', " % image.src +
                        u"'menubar=no,alwaysRaised=yes,dependent=yes," +
                        u"width=%s,height=%s,scrollbars=yes," % (w+10,h+50) +
                        u"screenX='+((screen.width/2)-(%s/2))+" % (w) +
                        u"',screenY='+((screen.height/2)-(%s/2))" % (h) +
                        u');"',
                        u'           alt="%s"' % image.caption,
                        u'           src="%s"/>' % image.thumbnailSrc,
                        u'        <div style="align:center;width:98%;">',
                        u'          %s' % image.caption,
                        u'        </div>']
            html = self._generateTable(genCell)
        return html
        
    def renderView(self, style):
        """
        Renders the html for export
        """
        # Temporarily change the resources Url for exporting the images nicely
        if len(self.idevice.images) > 0:
            cls = self.idevice.images[0].__class__
            oldUrl, cls.resourcesUrl = cls.resourcesUrl, ''
        try:
            html  = [u'    <div class="iDevice emphasis%s" ' %
                     unicode(self.idevice.emphasis),
                     u'>']
            html += self.renderSharedView(style)
            html += [u'</div>']
            return u'\n    '.join(html).encode('utf8')
        finally:
            # Put the resource url back
            if len(self.idevice.images) > 0:
                cls.resourcesUrl = oldUrl
                
