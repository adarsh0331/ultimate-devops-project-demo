// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { useState, useCallback } from 'react';
import { CypressFields } from '../../utils/Cypress';
import { useCart } from '../../providers/Cart.provider';
import CartDropdown from '../CartDropdown';
import * as S from './CartIcon.styled';

const CartIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCart();

  // UseCallback to handle onClose
  const handleClose = useCallback(() => {
    setIsOpen(false); // Close the dropdown when invoked
  }, []);

  return (
    <div>
      <S.CartIcon onClick={() => setIsOpen(true)} data-cy={CypressFields.CartIcon} />
      <CartDropdown 
        isOpen={isOpen} 
        onClose={handleClose} // Pass the callback to CartDropdown
        productList={cartItems} 
      />
    </div>
  );
};

export default CartIcon;
