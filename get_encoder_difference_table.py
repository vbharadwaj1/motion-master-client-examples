import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import sys
import math


def extract_lookup_table():
    # Read data from CSV file
    args = sys.argv[1:]
    data = pd.read_csv('output.csv')
    gear_ratio = int(args[2])
    encoder_1_resolution = int(args[0])
    encoder_2_resolution = int(args[1])

    if encoder_2_resolution != 0:
        encoder_ratio = encoder_1_resolution / encoder_2_resolution
    else:
        encoder_ratio = 1

    if encoder_1_resolution != 0:
        single_turn_value_encoder_1_ticks = data["ENCODER 1 TICKS"] % encoder_1_resolution
    else:
        single_turn_value_encoder_1_ticks = data["ENCODER 1 TICKS"] % 1
    encoder_difference_ticks = data["ENCODER 1 TICKS"] - (data["ENCODER 2 TICKS"] * encoder_ratio)/gear_ratio
    average_difference_ticks = np.average(encoder_difference_ticks);
    encoder_difference_ticks = encoder_difference_ticks - average_difference_ticks;

    num_points = 1024

    angles = np.linspace(0, encoder_1_resolution, num_points, endpoint=False, dtype='int')
    lookup_table = []
    for ang in angles:
        indexes = np.where((single_turn_value_encoder_1_ticks >= ang - 1000) & (single_turn_value_encoder_1_ticks <= ang + 1000))[0]
        value = np.mean(encoder_difference_ticks[indexes])
        if math.isnan(value):
            value = 0
        lookup_table.append(value)


    lookup_table_big_endinan_int16 = np.array(lookup_table, dtype=np.dtype('>i2'))
    print(lookup_table_big_endinan_int16.shape)


    with open('encoder_calibration_table.bin','wb') as f:
        lookup_table_big_endinan_int16.tofile(f)

    fig, axs = plt.subplots(2, figsize=(15, 15))

    axs[0].plot(lookup_table)
    axs[0].set_title('Lookup_table')
    axs[0].set_xlabel('No. of points')
    axs[0].set_ylabel('encoder Ticks')
    axs[0].grid('both')

    axs[1].plot(encoder_difference_ticks)
    axs[1].set_title('Encoder_difference_raw')
    axs[1].set_xlabel('No. of points')
    axs[1].set_ylabel('encoder Ticks')
    axs[1].grid(which='both')

    plt.savefig('lookup_table.png')

if __name__ == '__main__':
    extract_lookup_table()
