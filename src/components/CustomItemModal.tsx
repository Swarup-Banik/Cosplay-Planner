import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles, Image, Link, DollarSign } from 'lucide-react';
import { CosplayItem, ItemCategory, ItemStatus } from '../types';
import { useCosplay } from '../context/CosplayContext';

interface CustomItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<CosplayItem, 'id'>) => void;
  initialItem?: CosplayItem | null;
}

export const CustomItemModal: React.FC<CustomItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem
}) => {
  const { currency } = useCosplay();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Garment');
  const [status, setStatus] = useState<ItemStatus>('Missing');
  const [estimatedPrice, setEstimatedPrice] = useState<string>('1000');
  const [notes, setNotes] = useState('');
  const [shoppingUrl, setShoppingUrl] = useState('');
  const [referenceImage, setReferenceImage] = useState('');

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setCategory(initialItem.category);
      setStatus(initialItem.status);
      setEstimatedPrice(initialItem.estimatedPrice.toString());
      setNotes(initialItem.notes || '');
      setShoppingUrl(initialItem.shoppingUrl || '');
      setReferenceImage(initialItem.referenceImage || '');
    } else {
      setName('');
      setCategory('Garment');
      setStatus('Missing');
      setEstimatedPrice('1000');
      setNotes('');
      setShoppingUrl('');
      setReferenceImage('');
    }
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      category,
      status,
      estimatedPrice: parseFloat(estimatedPrice) || 0,
      notes: notes.trim(),
      shoppingUrl: shoppingUrl.trim() || undefined,
      referenceImage: referenceImage.trim() || undefined,
      isCustom: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-lavender-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-lavender-50 via-white to-blush-50 border-b border-lavender-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-lavender-100 text-dream-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-dream-950">
                {initialItem ? 'Edit Cosplay Item' : 'Add Cosplay Item'}
              </h3>
              <p className="text-xs text-dream-600">
                Customize your required props, garments, and accessories.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-lavender-100 text-dream-400 hover:text-dream-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          
          {/* Item Name */}
          <div>
            <label className="block font-semibold text-dream-900 mb-1">
              Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. White styled wig, Demon slayer haori, Gold stilettos..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-lavender-200 focus:border-dream-500 focus:ring-2 focus:ring-lavender-200 focus:outline-none text-dream-900 font-medium"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-dream-900 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-lavender-200 bg-white focus:border-dream-500 focus:outline-none text-dream-900 font-medium"
              >
                <option value="Garment">Garment (Coat, dress, pants)</option>
                <option value="Wig">Wig (Hair, styling fibers)</option>
                <option value="Prop">Prop (Sword, staff, wand)</option>
                <option value="Accessories">Accessories (Jewelry, belts)</option>
                <option value="Makeup">Makeup (Lenses, contour, scars)</option>
                <option value="Footwear">Footwear (Boots, geta, shoes)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-dream-900 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ItemStatus)}
                className="w-full px-3 py-2.5 rounded-xl border border-lavender-200 bg-white focus:border-dream-500 focus:outline-none text-dream-900 font-medium"
              >
                <option value="Missing">Missing (Not started)</option>
                <option value="In Progress">In Progress (Crafting / ordered)</option>
                <option value="Acquired">Acquired (Arrived / made)</option>
                <option value="Completed">Completed (Styled & ready)</option>
              </select>
            </div>
          </div>

          {/* Estimated Price */}
          <div>
            <label className="block font-semibold text-dream-900 mb-1">
              Estimated Price ({currency === 'INR' ? '₹ INR' : '$ USD'})
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-dream-400">
                {currency === 'INR' ? '₹' : '$'}
              </span>
              <input
                type="number"
                min="0"
                step="50"
                value={estimatedPrice}
                onChange={e => setEstimatedPrice(e.target.value)}
                placeholder="1500"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-lavender-200 focus:border-dream-500 focus:outline-none text-dream-900 font-mono font-medium"
              />
            </div>
          </div>

          {/* Crafting Notes */}
          <div>
            <label className="block font-semibold text-dream-900 mb-1">
              Notes & Styling Tips
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Need to tease roots with got2b spray, cut 2 inches off bangs..."
              className="w-full px-3.5 py-2 rounded-xl border border-lavender-200 focus:border-dream-500 focus:outline-none text-dream-900"
            />
          </div>

          {/* Optional Shopping URL */}
          <div>
            <label className="block font-semibold text-dream-900 mb-1">
              Shopping / Reference Link (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-dream-400">
                <Link className="w-3.5 h-3.5" />
              </span>
              <input
                type="url"
                value={shoppingUrl}
                onChange={e => setShoppingUrl(e.target.value)}
                placeholder="https://amazon.in or aliexpress..."
                className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-lavender-200 focus:border-dream-500 focus:outline-none text-dream-900 text-xs"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-lavender-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-dream-700 hover:bg-lavender-50 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-dream-600 to-lavender-600 text-white font-bold shadow-md hover:opacity-95 transition-all"
            >
              {initialItem ? 'Save Changes' : '+ Add Item'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
